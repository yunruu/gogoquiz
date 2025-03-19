import { v4 as uuidv4 } from 'uuid';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const getUuid = (): string => {
  return uuidv4();
};
