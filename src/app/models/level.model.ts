export interface Level {
    id: number;
    name: string;
    isUnlocked: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    layout: string[][];

  }