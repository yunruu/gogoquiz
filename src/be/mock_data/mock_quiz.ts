import { Quiz } from '../types';

const mathQuiz: Quiz = {
  id: '1',
  title: 'Math',
  description: 'Test your math skills',
  questions: [
    {
      id: '1',
      title: 'What is 2 + 2?',
      options: [{ text: '4' }, { text: '22' }, { text: '5' }, { text: '10' }],
      correctOption: 0,
    },
    {
      id: '2',
      title: 'What is 10 - 5?',
      options: [{ text: '5' }, { text: '10' }, { text: '15' }, { text: '20' }],
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
      title: 'What is the powerhouse of the cell?',
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
      title: 'What is the atomic number of Carbon?',
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
      title: 'Who was the first president of the United States?',
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
      title: 'What year did World War 2 end?',
      options: [
        { text: '1945', isCorrect: false },
        { text: '1937', isCorrect: true },
        { text: '1939', isCorrect: false },
        { text: '1941', isCorrect: false },
      ],
      correctOption: 1,
    },
    {
      id: '3',
      title: 'Who was the first emperor of Rome?',
      options: [
        { text: 'Julius Caesar', isCorrect: false },
        { text: 'Augustus', isCorrect: true },
        { text: 'Nero', isCorrect: false },
        { text: 'Hadrian', isCorrect: false },
      ],
      correctOption: 1,
    },
    {
      id: '4',
      title: 'What year did World War 1 start?',
      options: [
        { text: '1912', isCorrect: false },
        { text: '1910', isCorrect: false },
        { text: '1914', isCorrect: true },
        { text: '1916', isCorrect: false },
      ],
      correctOption: 2,
    },
  ],
};

const allQuizzes = [mathQuiz, scienceQuiz, historyQuiz];

export default allQuizzes;
