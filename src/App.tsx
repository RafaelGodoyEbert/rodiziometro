import React, { useState, useEffect, useCallback } from 'react';
import {
  Room,
  Participant,
  ConsumptionEvent,
  FoodItem,
  PersonalRecord,
  RodizioType,
} from './types';
import { DEFAULT_FOOD_CATALOG, getRecommendedFoods } from './domain/foodCatalog';
import {
  calculateParticipantStats,
  calculateCuriosities,
  checkAchievements,
} from './domain/statsCalculator';
import {
  getLocalParticipantId,
  getSavedNickname,
  saveNickname,
  getSavedRoom,
  saveRoomLocally,
  clearRoomLocally,
  getPersonalRecord,
  updatePersonalRecord,
  generateEventId,
} from './domain/eventStore';

// UI Components
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { PwaBanner } from './components/pwa/PwaBanner';
import { HomeView } from './components/home/HomeView';
import { CounterTab } from './components/counter/CounterTab';
import { BattleTab } from './components/battle/BattleTab';
import { CuriositiesTab } from './components/curiosities/CuriositiesTab';
import { RoomTab } from './components/room/RoomTab';
import { SummaryView } from './components/summary/SummaryView';
import { CreateRoomModal } from './components/room/CreateRoomModal';
import { JoinRoomModal } from './components/room/JoinRoomModal';
import { AddCustomFoodModal } from './components/counter/AddCustomFoodModal';

export default function App() {
  const [participantId] = useState<string>(getLocalParticipantId);
  const [nickname, setNickname] = useState<string>(getSavedNickname);
  const [room, setRoom] = useState<Room | null>(getSavedRoom);
  const [isSoloMode, setIsSoloMode] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<NavTab>('counter');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [joinCodeFromUrl, setJoinCodeFromUrl] = useState('');

  // Undo & Records
  const [lastAddedEvent, setLastAddedEvent] = useState<ConsumptionEvent | null>(null);
  const [personalRecord, setPersonalRecord] = useState<PersonalRecord>(getPersonalRecord);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check URL hash/query for room invite (e.g., #m=8FH2KD or ?m=8FH2KD)
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    let code = '';

    if (hash && hash.includes('m=')) {
      code = hash.split('m=')[1]?.substring(0, 8);
    } else if (search && search.includes('m=')) {
      const params = new URLSearchParams(search);
      code = params.get('m') || '';
    }

    if (code && (!room || room.code !== code.toUpperCase())) {
      setJoinCodeFromUrl(code.toUpperCase());
      setIsJoinOpen(true);
    }
  }, []);

  // Real-time SSE listener for Room updates
  useEffect(() => {
    if (!room || isSoloMode || room.status === 'ENDED') return;

    const eventSource = new EventSource(`/api/rooms/${room.code}/stream`);

    eventSource.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.type === 'ROOM_UPDATE' && payload.room) {
          setRoom(payload.room);
          saveRoomLocally(payload.room);
        }
      } catch (err) {
        console.error('SSE JSON error:', err);
      }
    };

    eventSource.onerror = () => {
      // EventSource auto retries connection
    };

    return () => {
      eventSource.close();
    };
  }, [room?.code, room?.status, isSoloMode]);

  // Create Room Handler
  const handleCreateRoom = async (data: { hostName: string; roomName: string; rodizioType: RodizioType }) => {
    saveNickname(data.hostName);
    setNickname(data.hostName);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: data.hostName,
          roomName: data.roomName,
          rodizioType: data.rodizioType,
          hostId: participantId,
        }),
      });

      if (!res.ok) throw new Error('Erro ao criar mesa');
      const json = await res.json();

      setRoom(json.room);
      saveRoomLocally(json.room);
      setIsSoloMode(false);
      setIsCreateOpen(false);
      setActiveTab('counter');
    } catch (err) {
      alert('Não foi possível conectar ao servidor. Iniciando em Modo Solo.');
      handleStartSoloMode();
      setIsCreateOpen(false);
    }
  };

  // Join Room Handler
  const handleJoinRoom = async (data: { roomCode: string; nickname: string }) => {
    saveNickname(data.nickname);
    setNickname(data.nickname);

    try {
      const res = await fetch(`/api/rooms/${data.roomCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: data.nickname,
          participantId,
        }),
      });

      if (!res.ok) {
        alert('Mesa não encontrada. Verifique o código informado.');
        return;
      }

      const json = await res.json();
      setRoom(json.room);
      saveRoomLocally(json.room);
      setIsSoloMode(false);
      setIsJoinOpen(false);
      setActiveTab('counter');
    } catch {
      alert('Erro ao conectar à mesa. Verifique sua conexão.');
    }
  };

  // Start Solo Mode Handler
  const handleStartSoloMode = () => {
    const soloParticipant: Participant = {
      id: participantId,
      nickname: nickname || 'Você',
      isHost: true,
      joinedAt: Date.now(),
      avatarColor: '#F97316',
    };

    const soloRoom: Room = {
      code: 'SOLO',
      name: 'Meu Rodízio Solo',
      rodizioType: 'MIXED',
      status: 'ACTIVE',
      createdAt: Date.now(),
      participants: [soloParticipant],
      events: [],
      customFoods: [],
    };

    setRoom(soloRoom);
    setIsSoloMode(true);
    setActiveTab('counter');
  };

  // Add Item Consumption Handler (Optimistic Update)
  const handleAddConsumption = async (food: FoodItem, quantity: number) => {
    if (!room) return;

    const newEvent: ConsumptionEvent = {
      id: generateEventId(),
      roomId: room.code,
      participantId,
      foodId: food.id,
      foodName: food.name,
      foodEmoji: food.emoji,
      category: food.category,
      quantity,
      pointsEarned: food.destructionPoints * quantity,
      timestamp: Date.now(),
    };

    // Apply Optimistic Local Update
    const updatedEvents = [...room.events, newEvent];
    const updatedRoom: Room = { ...room, events: updatedEvents };
    setRoom(updatedRoom);
    saveRoomLocally(updatedRoom);
    setLastAddedEvent(newEvent);

    // Auto dismiss undo toast after 5s
    setTimeout(() => {
      setLastAddedEvent((prev) => (prev?.id === newEvent.id ? null : prev));
    }, 5000);

    // Push event to server if in shared room
    if (!isSoloMode && room.code !== 'SOLO') {
      try {
        await fetch(`/api/rooms/${room.code}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });
      } catch {
        // Keeps local optimistic state
      }
    }
  };

  // Undo Consumption Event
  const handleUndoEvent = async (eventId: string) => {
    if (!room) return;

    const updatedEvents = room.events.filter((e) => e.id !== eventId);
    const updatedRoom: Room = { ...room, events: updatedEvents };
    setRoom(updatedRoom);
    saveRoomLocally(updatedRoom);
    setLastAddedEvent(null);

    if (!isSoloMode && room.code !== 'SOLO') {
      try {
        await fetch(`/api/rooms/${room.code}/events/${eventId}`, {
          method: 'DELETE',
        });
      } catch {
        // Keeps local change
      }
    }
  };

  // Add Custom Food
  const handleAddCustomFood = async (foodItem: FoodItem) => {
    if (!room) return;

    const updatedCustomFoods = [...(room.customFoods || []), foodItem];
    const updatedRoom: Room = { ...room, customFoods: updatedCustomFoods };
    setRoom(updatedRoom);
    saveRoomLocally(updatedRoom);

    if (!isSoloMode && room.code !== 'SOLO') {
      try {
        await fetch(`/api/rooms/${room.code}/custom-food`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodItem),
        });
      } catch {
        // Keeps local change
      }
    }
  };

  // End Room Session
  const handleEndRoom = async () => {
    if (!room) return;

    const updatedRoom: Room = { ...room, status: 'ENDED', endedAt: Date.now() };
    setRoom(updatedRoom);
    saveRoomLocally(updatedRoom);

    // Save personal record
    const userEvts = room.events.filter((e) => e.participantId === participantId);
    const totalItems = userEvts.reduce((a, b) => a + b.quantity, 0);
    const totalPoints = userEvts.reduce((a, b) => a + b.pointsEarned, 0);
    const rec = updatePersonalRecord(totalItems, totalPoints, null);
    setPersonalRecord(rec);

    if (!isSoloMode && room.code !== 'SOLO') {
      try {
        await fetch(`/api/rooms/${room.code}/end`, { method: 'POST' });
      } catch {
        // Keeps local change
      }
    }
  };

  // Restart Session
  const handleRestart = () => {
    clearRoomLocally();
    setRoom(null);
    setIsSoloMode(false);
    setActiveTab('counter');
  };

  // Derived Calculations
  const allFoods = getRecommendedFoods(
    room?.rodizioType || 'MIXED',
    room?.customFoods || []
  );

  const statsList = room
    ? calculateParticipantStats(room.participants, room.events, room.customFoods)
    : [];

  const myStats = statsList.find((s) => s.participantId === participantId) || null;

  const tableCuriosities = room
    ? calculateCuriosities(room.events, room.createdAt, room.customFoods)
    : {
        totalItems: 0,
        totalPoints: 0,
        estimatedKcalMin: 0,
        estimatedKcalMax: 0,
        estimatedProteinGrams: 0,
        estimatedCarbsGrams: 0,
        estimatedFatGrams: 0,
        estimatedWeightKg: 0,
        paceSecondsPerItem: 0,
        favoriteFood: null,
        longestStreak: null,
        dessertPercentage: 0,
        distinctItemsCount: 0,
        topLeaderTimeMinutes: 0,
      };

  const myCuriosities = room
    ? calculateCuriosities(room.events, room.createdAt, room.customFoods, participantId)
    : tableCuriosities;

  const userEvents = room ? room.events.filter((e) => e.participantId === participantId) : [];
  const achievements = checkAchievements(userEvents, room?.customFoods);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* App Header */}
      <Header
        room={room}
        isOffline={isOffline}
        onLogoClick={() => {
          if (!room) handleRestart();
        }}
      />

      {/* PWA Install Notification */}
      <PwaBanner />

      {/* Main View Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4">
        {!room ? (
          <HomeView
            onOpenCreateModal={() => setIsCreateOpen(true)}
            onOpenJoinModal={() => setIsJoinOpen(true)}
            onStartSoloMode={handleStartSoloMode}
            personalRecord={personalRecord}
          />
        ) : room.status === 'ENDED' ? (
          <SummaryView
            room={room}
            myStats={myStats}
            myCuriosities={myCuriosities}
            tableCuriosities={tableCuriosities}
            allStats={statsList}
            onRestart={handleRestart}
          />
        ) : (
          <>
            {activeTab === 'counter' && (
              <CounterTab
                foods={allFoods}
                userEvents={userEvents}
                myStats={myStats}
                onAddConsumption={handleAddConsumption}
                onUndoEvent={handleUndoEvent}
                onOpenAddCustomModal={() => setIsAddCustomOpen(true)}
                lastAddedEvent={lastAddedEvent}
              />
            )}

            {activeTab === 'battle' && (
              <BattleTab
                statsList={statsList}
                myParticipantId={participantId}
                achievements={achievements}
              />
            )}

            {activeTab === 'curiosities' && (
              <CuriositiesTab
                tableCuriosities={tableCuriosities}
                myCuriosities={myCuriosities}
              />
            )}

            {activeTab === 'room' && (
              <RoomTab
                room={room}
                myParticipantId={participantId}
                onEndRoom={handleEndRoom}
                onStartNewRoom={() => {
                  setRoom(null);
                  setIsCreateOpen(true);
                }}
              />
            )}

            {/* Bottom Navigation */}
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}
      </main>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateRoom}
        initialName={nickname}
      />

      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSubmit={handleJoinRoom}
        initialCode={joinCodeFromUrl}
        initialNickname={nickname}
      />

      <AddCustomFoodModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAdd={handleAddCustomFood}
      />
    </div>
  );
}
