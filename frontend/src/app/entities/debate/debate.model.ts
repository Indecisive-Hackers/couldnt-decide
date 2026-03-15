export type Stance = 'for' | 'against';

export interface IDebate {
  topic: string;
  stance: Stance;
}
