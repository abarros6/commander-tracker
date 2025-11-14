export const INITIAL_LIFE = 40;
export const INITIAL_TIME = 1200; // 20 minutes in seconds
export const COMMANDER_DAMAGE_THRESHOLD = 21;

// Subtle default player colors
export const PLAYER_COLORS_DEFAULT = [
  'border-red-800 bg-gray-800 border-opacity-50',
  'border-blue-800 bg-gray-800 border-opacity-50', 
  'border-green-800 bg-gray-800 border-opacity-50',
  'border-purple-800 bg-gray-800 border-opacity-50'
];

// Player color schemes for active states
export const PLAYER_COLORS_ACTIVE = [
  'border-red-600 bg-red-500 shadow-lg',
  'border-blue-600 bg-blue-500 shadow-lg',
  'border-green-600 bg-green-500 shadow-lg', 
  'border-purple-600 bg-purple-500 shadow-lg'
];

// Light colors for commander damage display
export const PLAYER_COLORS_LIGHT = [
  'bg-red-100 border-red-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300'
];