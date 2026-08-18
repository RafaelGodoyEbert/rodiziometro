import { FoodItem, FoodCategory, RodizioType } from '../types';

export const DEFAULT_FOOD_CATALOG: FoodItem[] = [
  {
    id: 'sushi_piece',
    name: 'Sushi / Sashimi',
    emoji: '🍣',
    category: 'SUSHI',
    destructionPoints: 1,
    servingUnit: 'peça',
    nutrition: { kcal: 35, protein: 1.8, carbs: 6.0, fat: 0.4, weightGrams: 25 },
  },
  {
    id: 'temaki',
    name: 'Temaki',
    emoji: '🍙',
    category: 'SUSHI',
    destructionPoints: 3,
    servingUnit: 'unidade',
    nutrition: { kcal: 180, protein: 8.0, carbs: 22.0, fat: 6.0, weightGrams: 120 },
  },
  {
    id: 'pizza_savory',
    name: 'Pizza Salgada',
    emoji: '🍕',
    category: 'PIZZA',
    destructionPoints: 4,
    servingUnit: 'fatia',
    nutrition: { kcal: 280, protein: 10.0, carbs: 32.0, fat: 12.0, weightGrams: 100 },
  },
  {
    id: 'pizza_sweet',
    name: 'Pizza Doce',
    emoji: '🍫',
    category: 'PIZZA',
    destructionPoints: 4,
    servingUnit: 'fatia',
    nutrition: { kcal: 310, protein: 6.0, carbs: 42.0, fat: 14.0, weightGrams: 95 },
  },
  {
    id: 'mini_burger',
    name: 'Mini Burger',
    emoji: '🍔',
    category: 'BURGER',
    destructionPoints: 5,
    servingUnit: 'unidade',
    nutrition: { kcal: 220, protein: 12.0, carbs: 20.0, fat: 10.0, weightGrams: 90 },
  },
  {
    id: 'gourmet_burger',
    name: 'Hambúrguer',
    emoji: '🍔',
    category: 'BURGER',
    destructionPoints: 8,
    servingUnit: 'unidade',
    nutrition: { kcal: 520, protein: 28.0, carbs: 40.0, fat: 28.0, weightGrams: 200 },
  },
  {
    id: 'meat_slice',
    name: 'Carne Nobre',
    emoji: '🥩',
    category: 'MEAT',
    destructionPoints: 3,
    servingUnit: 'fatia',
    nutrition: { kcal: 180, protein: 22.0, carbs: 0.5, fat: 10.0, weightGrams: 80 },
  },
  {
    id: 'garlic_bread',
    name: 'Pão de Alho',
    emoji: '🥖',
    category: 'MEAT',
    destructionPoints: 2,
    servingUnit: 'unidade',
    nutrition: { kcal: 140, protein: 3.0, carbs: 18.0, fat: 7.0, weightGrams: 50 },
  },
  {
    id: 'sausage_chicken',
    name: 'Linguiça / Frango',
    emoji: '🍗',
    category: 'MEAT',
    destructionPoints: 2,
    servingUnit: 'porção',
    nutrition: { kcal: 130, protein: 11.0, carbs: 1.0, fat: 9.0, weightGrams: 60 },
  },
  {
    id: 'pasta_portion',
    name: 'Massa / Risoto',
    emoji: '🍝',
    category: 'PASTA',
    destructionPoints: 4,
    servingUnit: 'porção',
    nutrition: { kcal: 250, protein: 8.0, carbs: 35.0, fat: 8.0, weightGrams: 120 },
  },
  {
    id: 'dessert_item',
    name: 'Sobremesa',
    emoji: '🍰',
    category: 'DESSERT',
    destructionPoints: 4,
    servingUnit: 'unidade',
    nutrition: { kcal: 230, protein: 4.0, carbs: 32.0, fat: 10.0, weightGrams: 80 },
  },
  {
    id: 'fries_appetizer',
    name: 'Batata Frita / Entrada',
    emoji: '🍟',
    category: 'APPETIZER',
    destructionPoints: 2,
    servingUnit: 'porção',
    nutrition: { kcal: 160, protein: 2.0, carbs: 20.0, fat: 8.0, weightGrams: 70 },
  },
  {
    id: 'drink_beverage',
    name: 'Bebida / Suco',
    emoji: '🥤',
    category: 'DRINK',
    destructionPoints: 1,
    servingUnit: 'copo',
    nutrition: { kcal: 110, protein: 0.0, carbs: 28.0, fat: 0.0, weightGrams: 250 },
  },
];

export const RODIZIO_TYPES: { type: RodizioType; name: string; emoji: string; primaryCategories: FoodCategory[] }[] = [
  { type: 'PIZZA', name: 'Pizza', emoji: '🍕', primaryCategories: ['PIZZA', 'DESSERT', 'DRINK'] },
  { type: 'SUSHI', name: 'Sushi / Japa', emoji: '🍣', primaryCategories: ['SUSHI', 'DESSERT', 'DRINK'] },
  { type: 'BURGER', name: 'Hambúrguer', emoji: '🍔', primaryCategories: ['BURGER', 'APPETIZER', 'DRINK'] },
  { type: 'MEAT', name: 'Churrasco / Carnes', emoji: '🥩', primaryCategories: ['MEAT', 'APPETIZER', 'DRINK'] },
  { type: 'PASTA', name: 'Massas', emoji: '🍝', primaryCategories: ['PASTA', 'DESSERT', 'DRINK'] },
  { type: 'DESSERT', name: 'Doces / Sobremesas', emoji: '🍰', primaryCategories: ['DESSERT', 'DRINK'] },
  { type: 'MIXED', name: 'Misto / Geral', emoji: '🍽️', primaryCategories: ['PIZZA', 'SUSHI', 'BURGER', 'MEAT', 'PASTA', 'DESSERT', 'APPETIZER'] },
  { type: 'CUSTOM', name: 'Personalizado', emoji: '🎨', primaryCategories: ['OTHER'] },
];

export function getRecommendedFoods(rodizioType: RodizioType, customFoods: FoodItem[] = []): FoodItem[] {
  const allFoods = [...DEFAULT_FOOD_CATALOG, ...customFoods];
  const typeConfig = RODIZIO_TYPES.find((t) => t.type === rodizioType);
  if (!typeConfig || rodizioType === 'MIXED') {
    return allFoods;
  }
  
  // Sort foods matching primary categories first, then others
  return allFoods.sort((a, b) => {
    const aPrimary = typeConfig.primaryCategories.includes(a.category) ? 0 : 1;
    const bPrimary = typeConfig.primaryCategories.includes(b.category) ? 0 : 1;
    return aPrimary - bPrimary;
  });
}
