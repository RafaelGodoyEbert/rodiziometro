import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Room, Participant, ConsumptionEvent, FoodItem, RodizioType } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for active rooms
const roomsStore = new Map<string, Room>();

// SSE clients map: roomCode -> Set of Response objects
const sseClients = new Map<string, Set<Response>>();

function broadcastRoomUpdate(roomCode: string) {
  const room = roomsStore.get(roomCode.toUpperCase());
  if (!room) return;

  const clients = sseClients.get(roomCode.toUpperCase());
  if (!clients || clients.size === 0) return;

  const data = JSON.stringify({ type: 'ROOM_UPDATE', room });
  clients.forEach((client) => {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

// Generate short random room code (e.g., "8FH2KD")
function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // avoiding ambiguous O,0,I,1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const AVATAR_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

// --- API ROUTES ---

// 1. Create Room
app.post('/api/rooms', (req: Request, res: Response) => {
  const { hostName, roomName, rodizioType, hostId } = req.body;

  if (!hostName || !hostName.trim()) {
    return res.status(400).json({ error: 'Apelido do criador é obrigatório' });
  }

  let code = generateRoomCode();
  while (roomsStore.has(code)) {
    code = generateRoomCode();
  }

  const hostParticipant: Participant = {
    id: hostId || 'usr_' + Math.random().toString(36).substring(2, 9),
    nickname: hostName.trim(),
    isHost: true,
    joinedAt: Date.now(),
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };

  const newRoom: Room = {
    code,
    name: (roomName && roomName.trim()) || `Mesa #${code}`,
    rodizioType: (rodizioType as RodizioType) || 'MIXED',
    status: 'ACTIVE',
    createdAt: Date.now(),
    participants: [hostParticipant],
    events: [],
    customFoods: [],
  };

  roomsStore.set(code, newRoom);
  res.json({ room: newRoom, participant: hostParticipant });
});

// 2. Get Room
app.get('/api/rooms/:code', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const room = roomsStore.get(code);

  if (!room) {
    return res.status(404).json({ error: 'Mesa não encontrada' });
  }

  res.json({ room });
});

// 3. Join Room
app.post('/api/rooms/:code/join', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const { nickname, participantId } = req.body;

  if (!nickname || !nickname.trim()) {
    return res.status(400).json({ error: 'Apelido é obrigatório' });
  }

  const room = roomsStore.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Mesa não encontrada' });
  }

  const pid = participantId || 'usr_' + Math.random().toString(36).substring(2, 9);
  let existingParticipant = room.participants.find((p) => p.id === pid);

  if (!existingParticipant) {
    existingParticipant = {
      id: pid,
      nickname: nickname.trim(),
      isHost: false,
      joinedAt: Date.now(),
      avatarColor: AVATAR_COLORS[room.participants.length % AVATAR_COLORS.length],
    };
    room.participants.push(existingParticipant);
    broadcastRoomUpdate(code);
  } else {
    existingParticipant.nickname = nickname.trim();
    broadcastRoomUpdate(code);
  }

  res.json({ room, participant: existingParticipant });
});

// 4. Register Consumption Event
app.post('/api/rooms/:code/events', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const eventData: ConsumptionEvent = req.body;

  const room = roomsStore.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Mesa não encontrada' });
  }

  if (room.status === 'ENDED') {
    return res.status(400).json({ error: 'Mesa já foi encerrada' });
  }

  // Idempotency check: prevent duplicate event registration
  const alreadyExists = room.events.some((e) => e.id === eventData.id);
  if (!alreadyExists) {
    room.events.push(eventData);
    broadcastRoomUpdate(code);
  }

  res.json({ success: true, room });
});

// 5. Undo Event
app.delete('/api/rooms/:code/events/:eventId', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const { eventId } = req.params;

  const room = roomsStore.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Mesa não encontrada' });
  }

  const idx = room.events.findIndex((e) => e.id === eventId);
  if (idx !== -1) {
    room.events.splice(idx, 1);
    broadcastRoomUpdate(code);
  }

  res.json({ success: true, room });
});

// 6. Add Custom Food Item
app.post('/api/rooms/:code/custom-food', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const foodItem: FoodItem = req.body;

  const room = roomsStore.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Mesa não encontrada' });
  }

  if (!room.customFoods) {
    room.customFoods = [];
  }

  room.customFoods.push(foodItem);
  broadcastRoomUpdate(code);

  res.json({ success: true, room });
});

// 7. End Room Session
app.post('/api/rooms/:code/end', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const room = roomsStore.get(code);

  if (!room) {
    return res.status(404).json({ error: 'Mesa não encontrada' });
  }

  room.status = 'ENDED';
  room.endedAt = Date.now();
  broadcastRoomUpdate(code);

  res.json({ success: true, room });
});

// 8. Server-Sent Events (SSE) Stream
app.get('/api/rooms/:code/stream', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(code)) {
    sseClients.set(code, new Set());
  }
  const roomClients = sseClients.get(code)!;
  roomClients.add(res);

  // Send initial room snapshot if available
  const room = roomsStore.get(code);
  if (room) {
    res.write(`data: ${JSON.stringify({ type: 'ROOM_UPDATE', room })}\n\n`);
  }

  // Heartbeat interval every 15s to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    roomClients.delete(res);
  });
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
