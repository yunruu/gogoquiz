/* eslint-disable @typescript-eslint/no-unused-vars */
import allQuizzes from './mock_data/mock_quiz';
import { getItem, setItem } from './service/storage';
import { Quiz } from './types';

const QUIZ_KEY = "quiz";


const injectData = () => {
  setItem(QUIZ_KEY, allQuizzes);
};

export const getAllQuizzes = (): Quiz[] => {
  const data = getItem(QUIZ_KEY) as Quiz[];
  if (!data || data.length === 0) {
    injectData();
    return getAllQuizzes();
  }
  return data;
};

export const getQuizById = (id: string): Quiz => {
  try {
    const quiz = getAllQuizzes().find((quiz) => quiz.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  } catch (e) {
    throw new Error('Quiz not found');
  }
};

export const createQuiz = (quiz: Quiz): Quiz => {
  if (!quiz.id) {
    throw new Error('Quiz ID is required');
  }
  if (!quiz.title) {
    throw new Error('Quiz title is required');
  }
  if (!quiz.description) {
    throw new Error('Quiz description is required');
  }
  if (!quiz.questions || quiz.questions.length === 0) {
    throw new Error('Quiz questions are required');
  }
  if (quiz.questions.some((q) => !q.title)) {
    throw new Error('Quiz questions must have a title');
  }
  if (quiz.questions.some((q) => !q.options || q.options.length === 0)) {
    throw new Error('Quiz questions must have at least one option');
  }
  if (quiz.questions.some((q) => q.options.some((o) => !o.text))) {
    throw new Error('Quiz question options must have text');
  }
  if (quiz.questions.some((q) => q.options.filter((o) => o.isCorrect).length !== 1)) {
    throw new Error('Quiz question must have exactly one correct option');
  }
  if (quiz.questions.some((q) => q.correctOption < 0 || q.correctOption >= q.options.length)) {
    throw new Error('Quiz question correct option is invalid');
  }
  const quizzes = getAllQuizzes();
  quizzes.push(quiz);
  setItem(QUIZ_KEY, quizzes);
  return quiz;
};
