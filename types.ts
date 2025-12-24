export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'night';

export enum AvatarType {
  CAT = 'cat',
  RABBIT = 'rabbit',
  PANDA = 'panda',
  BIRD = 'bird',
}

export interface PlayerProfile {
  name: string;
  avatar: AvatarType;
}

export interface AvatarConfig {
  id: AvatarType;
  name: string;
  emoji: string;
  colors: string; // Tailwind class for bg
}

export type AdventureMode = 'learning' | 'simulation' | 'quiz';
