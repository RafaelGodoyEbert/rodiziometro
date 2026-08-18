import { ConsumptionEvent, PersonalRecord, Room, Participant } from '../types';

const STORAGE_KEYS = {
  CURRENT_ROOM: 'rodiziometro_current_room',
  MY_PARTICIPANT_ID: 'rodiziometro_participant_id',
  MY_NICKNAME: 'rodiziometro_nickname',
  PENDING_EVENTS: 'rodiziometro_pending_events',
  PERSONAL_RECORDS: 'rodiziometro_records',
};

export function getLocalParticipantId(): string {
  let pid = localStorage.getItem(STORAGE_KEYS.MY_PARTICIPANT_ID);
  if (!pid) {
    pid = 'usr_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(STORAGE_KEYS.MY_PARTICIPANT_ID, pid);
  }
  return pid;
}

export function getSavedNickname(): string {
  return localStorage.getItem(STORAGE_KEYS.MY_NICKNAME) || '';
}

export function saveNickname(nickname: string): void {
  localStorage.setItem(STORAGE_KEYS.MY_NICKNAME, nickname.trim());
}

export function getSavedRoom(): Room | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ROOM);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to parse room from storage:', e);
    return null;
  }
}

export function saveRoomLocally(room: Room): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROOM, JSON.stringify(room));
  } catch (e) {
    console.error('Failed to save room locally:', e);
  }
}

export function clearRoomLocally(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_ROOM);
}

export function getPendingEvents(): ConsumptionEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_EVENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addPendingEventLocally(event: ConsumptionEvent): void {
  const pending = getPendingEvents();
  pending.push(event);
  localStorage.setItem(STORAGE_KEYS.PENDING_EVENTS, JSON.stringify(pending));
}

export function clearPendingEvents(): void {
  localStorage.removeItem(STORAGE_KEYS.PENDING_EVENTS);
}

export function getPersonalRecord(): PersonalRecord {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return {
    maxItems: 0,
    maxPoints: 0,
    totalSessions: 0,
    topCategory: null,
    lastSessionAt: Date.now(),
  };
}

export function updatePersonalRecord(items: number, points: number, category: any): PersonalRecord {
  const current = getPersonalRecord();
  const updated: PersonalRecord = {
    maxItems: Math.max(current.maxItems, items),
    maxPoints: Math.max(current.maxPoints, points),
    totalSessions: current.totalSessions + 1,
    topCategory: items > current.maxItems ? category : current.topCategory,
    lastSessionAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(updated));
  return updated;
}

export function generateEventId(): string {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
}
