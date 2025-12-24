import { AvatarType, AvatarConfig } from './types';

export const AVATAR_OPTIONS: AvatarConfig[] = [
  { id: AvatarType.CAT, name: 'Kucing', emoji: '🐱', colors: 'bg-orange-200 border-orange-400' },
  { id: AvatarType.RABBIT, name: 'Kelinci', emoji: '🐰', colors: 'bg-pink-100 border-pink-300' },
  { id: AvatarType.PANDA, name: 'Panda', emoji: '🐼', colors: 'bg-gray-200 border-gray-500' },
  { id: AvatarType.BIRD, name: 'Burung', emoji: '🐦', colors: 'bg-blue-200 border-blue-400' },
];

export const DEFAULT_PROFILE = {
  name: 'Petualang Cilik',
  avatar: AvatarType.RABBIT,
};
