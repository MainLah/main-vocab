export type APIResponse = {
  id: number;
  word: string;
  phonetic?: string;
  part_of_speech: string[];
  definitions?: string[];
};
