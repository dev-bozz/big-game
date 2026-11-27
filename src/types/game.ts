export type Difficulty = 'easy' | 'medium' | 'hard';
export interface Question { id:string; text:string; answers:{id:string;text:string}[]; correctId:string; difficulty:Difficulty; explanation:string }
export type GameStatus='start'|'playing'|'confirming'|'revealing'|'finished';
export type EndReason='wrong'|'walkaway'|'won'|'timeout';
export type Lifeline='fifty'|'phone'|'audience';
