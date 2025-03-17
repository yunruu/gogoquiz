/* eslint-disable @typescript-eslint/no-unused-vars */
import { Quiz } from './types';

const mathQuiz: Quiz = {
  id: '1',
  title: 'Math',
  description: 'Test your math skills',
  questions: [
    {
      id: '1',
      text: 'What is 2 + 2?',
      options: [
        { text: '4', isCorrect: true },
        { text: '22', isCorrect: false },
        { text: '5', isCorrect: false },
        { text: '10', isCorrect: false },
      ],
      correctOption: 0,
    },
    {
      id: '2',
      text: 'What is 10 - 5?',
      options: [
        { text: '5', isCorrect: true },
        { text: '10', isCorrect: false },
        { text: '15', isCorrect: false },
        { text: '20', isCorrect: false },
      ],
      correctOption: 0,
    },
  ],
};

const scienceQuiz = {
  id: '2',
  title: 'Science',
  description: 'Test your science knowledge',
  questions: [
    {
      id: '1',
      text: 'What is the powerhouse of the cell?',
      options: [
        { text: 'Nucleus', isCorrect: false },
        { text: 'Mitochondria', isCorrect: true },
        { text: 'Ribosome', isCorrect: false },
        { text: 'Endoplasmic Reticulum', isCorrect: false },
      ],
      correctOption: 1,
    },
    {
      id: '2',
      text: 'What is the atomic number of Carbon?',
      options: [
        { text: '5', isCorrect: false },
        { text: '6', isCorrect: true },
        { text: '7', isCorrect: false },
        { text: '8', isCorrect: false },
      ],
      correctOption: 1,
    },
  ],
};

const historyQuiz = {
  id: '3',
  title: 'History',
  description: 'Test your history knowledge',
  questions: [
    {
      id: '1',
      text: 'Who was the first president of the United States?',
      options: [
        { text: 'George Washington', isCorrect: true },
        { text: 'Thomas Jefferson', isCorrect: false },
        { text: 'John Adams', isCorrect: false },
        { text: 'Abraham Lincoln', isCorrect: false },
      ],
      correctOption: 0,
    },
    {
      id: '2',
      text: 'What year did World War 2 end?',
      options: [
        { text: '1945', isCorrect: true },
        { text: '1940', isCorrect: false },
        { text: '1939', isCorrect: false },
        { text: '1941', isCorrect: false },
      ],
      correctOption: 0,
    },
  ],
};

const allQuizzes = [mathQuiz, scienceQuiz, historyQuiz];

export const getAllQuizzes = (): Quiz[] => {
  return allQuizzes;
};

export const getQuizById = (id: string): Quiz => {
  try {
    const quiz = allQuizzes.find((quiz) => quiz.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  } catch (e) {
    throw new Error('Quiz not found');
  }
};
