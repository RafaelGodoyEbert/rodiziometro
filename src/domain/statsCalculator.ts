import {
  ConsumptionEvent,
  FoodItem,
  FoodCategory,
  Participant,
  ParticipantStats,
  TableCuriosities,
  Achievement,
} from '../types';
import { DEFAULT_FOOD_CATALOG } from './foodCatalog';

export function getFoodMap(customFoods: FoodItem[] = []): Map<string, FoodItem> {
  const map = new Map<string, FoodItem>();
  DEFAULT_FOOD_CATALOG.forEach((item) => map.set(item.id, item));
  customFoods.forEach((item) => map.set(item.id, item));
  return map;
}

export function calculateParticipantStats(
  participants: Participant[],
  events: ConsumptionEvent[],
  customFoods: FoodItem[] = []
): ParticipantStats[] {
  const foodMap = getFoodMap(customFoods);
  
  // Initialize map for each participant
  const statsMap = new Map<string, ParticipantStats>();
  participants.forEach((p) => {
    statsMap.set(p.id, {
      participantId: p.id,
      nickname: p.nickname,
      avatarColor: p.avatarColor || '#3B82F6',
      totalItems: 0,
      totalPoints: 0,
      categoryTotals: {
        PIZZA: 0,
        SUSHI: 0,
        BURGER: 0,
        MEAT: 0,
        PASTA: 0,
        DESSERT: 0,
        APPETIZER: 0,
        DRINK: 0,
        OTHER: 0,
      },
      categoryPoints: {
        PIZZA: 0,
        SUSHI: 0,
        BURGER: 0,
        MEAT: 0,
        PASTA: 0,
        DESSERT: 0,
        APPETIZER: 0,
        DRINK: 0,
        OTHER: 0,
      },
      crowns: [],
      rank: 1,
    });
  });

  // Food consumption counters per user
  const userFoodCounts: Record<string, Record<string, number>> = {};

  // Accumulate events
  events.forEach((evt) => {
    const pStats = statsMap.get(evt.participantId);
    if (!pStats) return;

    pStats.totalItems += evt.quantity;
    pStats.totalPoints += evt.pointsEarned;

    const cat = evt.category || 'OTHER';
    pStats.categoryTotals[cat] = (pStats.categoryTotals[cat] || 0) + evt.quantity;
    pStats.categoryPoints[cat] = (pStats.categoryPoints[cat] || 0) + evt.pointsEarned;

    if (!userFoodCounts[evt.participantId]) {
      userFoodCounts[evt.participantId] = {};
    }
    userFoodCounts[evt.participantId][evt.foodId] =
      (userFoodCounts[evt.participantId][evt.foodId] || 0) + evt.quantity;
  });

  // Calculate favorite food for each participant
  statsMap.forEach((pStats, pid) => {
    const foodCounts = userFoodCounts[pid] || {};
    let maxCount = 0;
    let favFoodId = '';
    Object.entries(foodCounts).forEach(([fid, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favFoodId = fid;
      }
    });

    if (favFoodId) {
      const food = foodMap.get(favFoodId);
      if (food) {
        pStats.favoriteFoodName = food.name;
        pStats.favoriteFoodEmoji = food.emoji;
      }
    }
  });

  // Convert to array and calculate overall ranks
  const sortedStats = Array.from(statsMap.values()).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.totalItems - a.totalItems;
  });

  sortedStats.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  // Calculate category crowns (Rei da Pizza, Rei do Sushi, etc.)
  const categories: { cat: FoodCategory; title: string; emoji: string }[] = [
    { cat: 'PIZZA', title: 'Rei da Pizza', emoji: '🍕' },
    { cat: 'SUSHI', title: 'Rei do Sushi', emoji: '🍣' },
    { cat: 'BURGER', title: 'Rei do Burger', emoji: '🍔' },
    { cat: 'MEAT', title: 'Rei da Carne', emoji: '🥩' },
    { cat: 'PASTA', title: 'Rei da Massa', emoji: '🍝' },
    { cat: 'DESSERT', title: 'Rei do Doce', emoji: '🍰' },
  ];

  categories.forEach(({ cat, title, emoji }) => {
    let maxCatCount = 0;
    let crownWinners: ParticipantStats[] = [];

    sortedStats.forEach((p) => {
      const count = p.categoryTotals[cat] || 0;
      if (count > 0 && count > maxCatCount) {
        maxCatCount = count;
        crownWinners = [p];
      } else if (count > 0 && count === maxCatCount) {
        crownWinners.push(p);
      }
    });

    if (maxCatCount >= 2) {
      crownWinners.forEach((winner) => {
        winner.crowns.push(`${title} ${emoji}`);
      });
    }
  });

  return sortedStats;
}

export function calculateCuriosities(
  events: ConsumptionEvent[],
  roomStartTime: number,
  customFoods: FoodItem[] = [],
  filterParticipantId?: string
): TableCuriosities {
  const foodMap = getFoodMap(customFoods);
  const filteredEvents = filterParticipantId
    ? events.filter((e) => e.participantId === filterParticipantId)
    : events;

  let totalItems = 0;
  let totalPoints = 0;
  let estKcal = 0;
  let estProtein = 0;
  let estCarbs = 0;
  let estFat = 0;
  let estWeightGrams = 0;
  let dessertItems = 0;

  const foodUsage: Record<string, { count: number; name: string; emoji: string }> = {};

  filteredEvents.forEach((evt) => {
    totalItems += evt.quantity;
    totalPoints += evt.pointsEarned;

    if (evt.category === 'DESSERT') {
      dessertItems += evt.quantity;
    }

    const food = foodMap.get(evt.foodId);
    if (food) {
      estKcal += food.nutrition.kcal * evt.quantity;
      estProtein += food.nutrition.protein * evt.quantity;
      estCarbs += food.nutrition.carbs * evt.quantity;
      estFat += food.nutrition.fat * evt.quantity;
      estWeightGrams += food.nutrition.weightGrams * evt.quantity;
    } else {
      // Fallback generic estimate per item
      estKcal += 150 * evt.quantity;
      estProtein += 5 * evt.quantity;
      estCarbs += 18 * evt.quantity;
      estFat += 6 * evt.quantity;
      estWeightGrams += 60 * evt.quantity;
    }

    if (!foodUsage[evt.foodId]) {
      foodUsage[evt.foodId] = {
        count: 0,
        name: evt.foodName,
        emoji: evt.foodEmoji,
      };
    }
    foodUsage[evt.foodId].count += evt.quantity;
  });

  // Kcal interval (~10% variance to reflect natural uncertainty)
  const minKcal = Math.round(estKcal * 0.9);
  const maxKcal = Math.round(estKcal * 1.1);

  // Eating pace (seconds per item)
  const durationMs = Math.max(1000, Date.now() - roomStartTime);
  const durationSeconds = durationMs / 1000;
  const paceSecondsPerItem = totalItems > 0 ? Math.round(durationSeconds / totalItems) : 0;

  // Favorite food
  let favoriteFood: { name: string; emoji: string; count: number } | null = null;
  let maxFoodCount = 0;
  Object.values(foodUsage).forEach((item) => {
    if (item.count > maxFoodCount) {
      maxFoodCount = item.count;
      favoriteFood = { name: item.name, emoji: item.emoji, count: item.count };
    }
  });

  // Calculate longest streak (most items consumed within any 15 minute window)
  let longestStreak: { count: number; minutes: number } | null = null;
  if (filteredEvents.length > 0) {
    const sortedEvents = [...filteredEvents].sort((a, b) => a.timestamp - b.timestamp);
    let maxStreak = 0;
    let windowDurationMin = 15;

    for (let i = 0; i < sortedEvents.length; i++) {
      let count = 0;
      const windowStart = sortedEvents[i].timestamp;
      const windowEnd = windowStart + 15 * 60 * 1000;

      for (let j = i; j < sortedEvents.length; j++) {
        if (sortedEvents[j].timestamp <= windowEnd) {
          count += sortedEvents[j].quantity;
        } else {
          break;
        }
      }

      if (count > maxStreak) {
        maxStreak = count;
      }
    }

    if (maxStreak >= 3) {
      longestStreak = { count: maxStreak, minutes: windowDurationMin };
    }
  }

  const dessertPercentage = totalItems > 0 ? Math.round((dessertItems / totalItems) * 100) : 0;
  const distinctItemsCount = Object.keys(foodUsage).length;
  const topLeaderTimeMinutes = Math.round(durationSeconds / 60);

  return {
    totalItems,
    totalPoints,
    estimatedKcalMin: minKcal,
    estimatedKcalMax: maxKcal,
    estimatedProteinGrams: Math.round(estProtein),
    estimatedCarbsGrams: Math.round(estCarbs),
    estimatedFatGrams: Math.round(estFat),
    estimatedWeightKg: Number((estWeightGrams / 1000).toFixed(1)),
    paceSecondsPerItem,
    favoriteFood,
    longestStreak,
    dessertPercentage,
    distinctItemsCount,
    topLeaderTimeMinutes,
  };
}

export function checkAchievements(
  participantEvents: ConsumptionEvent[],
  customFoods: FoodItem[] = []
): Achievement[] {
  const totalItems = participantEvents.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPoints = participantEvents.reduce((acc, curr) => acc + curr.pointsEarned, 0);
  const uniqueFoodIds = new Set(participantEvents.map((e) => e.foodId)).size;
  const dessertCount = participantEvents
    .filter((e) => e.category === 'DESSERT')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const achievements: Achievement[] = [
    {
      id: 'warmup',
      title: 'Aquecimento Concluído',
      description: 'Consumiu 10 itens no rodízio.',
      icon: '🍕',
      thresholdCount: 10,
      unlocked: totalItems >= 10,
    },
    {
      id: 'getting_started',
      title: 'Agora Começou',
      description: 'Chegou à marca de 20 itens.',
      icon: '🍣',
      thresholdCount: 20,
      unlocked: totalItems >= 20,
    },
    {
      id: 'kitchen_notice',
      title: 'Alerta na Cozinha',
      description: '30 itens! A cozinha notou sua presença.',
      icon: '🔥',
      thresholdCount: 30,
      unlocked: totalItems >= 30,
    },
    {
      id: 'rest_calculating',
      title: 'Falência Técnica',
      description: '50 itens! O gerente está refazendo as contas.',
      icon: '💀',
      thresholdCount: 50,
      unlocked: totalItems >= 50,
    },
    {
      id: 'taster',
      title: 'Provador Profissional',
      description: 'Experimentou 5 tipos diferentes de comida.',
      icon: '🌟',
      specialCondition: 'VARIETY',
      unlocked: uniqueFoodIds >= 5,
    },
    {
      id: 'dessert_lover',
      title: 'Espaço Reserva',
      description: 'Consumiu 3 ou mais sobremesas.',
      icon: '🍰',
      specialCondition: 'DESSERT',
      unlocked: dessertCount >= 3,
    },
  ];

  return achievements;
}
