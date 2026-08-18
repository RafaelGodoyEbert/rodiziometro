export type RodizioType =
  | 'PIZZA'
  | 'SUSHI'
  | 'BURGER'
  | 'MEAT'
  | 'PASTA'
  | 'DESSERT'
  | 'MIXED'
  | 'CUSTOM';

export type FoodCategory =
  | 'PIZZA'
  | 'SUSHI'
  | 'BURGER'
  | 'MEAT'
  | 'PASTA'
  | 'DESSERT'
  | 'APPETIZER'
  | 'DRINK'
  | 'OTHER';

export interface NutritionEstimate {
  kcal: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  weightGrams: number; // in grams
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  destructionPoints: number;
  servingUnit: string; // e.g. "fatia", "peça", "unidade"
  nutrition: NutritionEstimate;
  isCustom?: boolean;
}

export interface ConsumptionEvent {
  id: string;
  roomId: string;
  participantId: string;
  foodId: string;
  foodName: string;
  foodEmoji: string;
  category: FoodCategory;
  quantity: number;
  pointsEarned: number;
  timestamp: number;
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  joinedAt: number;
  avatarColor: string;
}

export interface Room {
  code: string;
  name: string;
  rodizioType: RodizioType;
  status: 'ACTIVE' | 'ENDED';
  createdAt: number;
  endedAt?: number;
  participants: Participant[];
  events: ConsumptionEvent[];
  customFoods?: FoodItem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  thresholdCount?: number;
  thresholdPoints?: number;
  specialCondition?: 'VARIETY' | 'DESSERT' | 'FAST_STREAK';
  unlocked?: boolean;
}

export interface UserCategoryTotal {
  category: FoodCategory;
  count: number;
  points: number;
  foodName: string;
  emoji: string;
}

export interface ParticipantStats {
  participantId: string;
  nickname: string;
  avatarColor: string;
  totalItems: number;
  totalPoints: number;
  categoryTotals: Record<FoodCategory, number>;
  categoryPoints: Record<FoodCategory, number>;
  crowns: string[]; // e.g., ["Rei da Pizza 🍕", "Rei do Sushi 🍣"]
  rank: number;
  prevRank?: number;
  favoriteFoodName?: string;
  favoriteFoodEmoji?: string;
}

export interface TableCuriosities {
  totalItems: number;
  totalPoints: number;
  estimatedKcalMin: number;
  estimatedKcalMax: number;
  estimatedProteinGrams: number;
  estimatedCarbsGrams: number;
  estimatedFatGrams: number;
  estimatedWeightKg: number;
  paceSecondsPerItem: number;
  favoriteFood: { name: string; emoji: string; count: number } | null;
  longestStreak: { count: number; minutes: number } | null;
  dessertPercentage: number;
  distinctItemsCount: number;
  topLeaderTimeMinutes: number;
  peakWindowTime?: string;
}

export interface PersonalRecord {
  maxItems: number;
  maxPoints: number;
  totalSessions: number;
  topCategory: FoodCategory | null;
  lastSessionAt: number;
}
