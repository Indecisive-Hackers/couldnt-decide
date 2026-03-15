export type ArgumentAuthor = 'user' | 'ai';

export interface IArgument {
  author: ArgumentAuthor;
  content: string;
  factCheck: string | null;
  round: number;
}
