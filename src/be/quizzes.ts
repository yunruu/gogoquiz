import { getUuid } from '@/utils/randomiser';
import { getItem, setItem } from './service/storage';
import { ImportType, Quiz } from './types';

const QUIZ_KEY = 'quiz';

// const injectData = () => {
//   setItem(QUIZ_KEY, allQuizzes);
// };

export const getAllQuizzes = (): Quiz[] => {
  const data = getItem(QUIZ_KEY) as Quiz[];
  if (!data || data.length === 0) {
    return [];
  }
  return data;
};

export const getQuizById = (id: string): Quiz => {
  const quiz = getAllQuizzes().find((quiz) => quiz.id === id);
  if (!quiz) {
    throw new Error('Quiz not found');
  }
  return quiz;
};

export const createQuiz = (quiz: Quiz): Quiz => {
  quiz.id = getUuid();

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
  if (quiz.questions.some((q) => q.correctOption < 0 || q.correctOption >= q.options.length)) {
    throw new Error('Quiz question correct option is invalid');
  }
  const quizzes = getAllQuizzes();
  quizzes.push(quiz);
  setItem(QUIZ_KEY, quizzes);
  return quiz;
};

export const importQuizzes = (quizzes: Quiz[], importType: ImportType): Quiz[] => {
  const idSet = new Set<string>();
  const allQuizzes = getAllQuizzes();

  for (const quiz of allQuizzes) {
    idSet.add(quiz.id);
  }

  for (const quiz of quizzes) {
    // skip if duplicate quiz id already exists
    if (idSet.has(quiz.id)) {
      continue;
    }
    // generate new id if not provided
    quiz.id = quiz.id || getUuid();

    switch (importType) {
      case ImportType.Overwrite:
        let hit = false;
        for (let i = 0; i < allQuizzes.length; i++) {
          if (allQuizzes[i].title === quiz.title) {
            allQuizzes[i] = quiz;
            hit = true;
            break;
          }
        }
        // no duplicate title
        if (!hit) {
          allQuizzes.push(quiz);
        }
        break;
      case ImportType.Merge:
        allQuizzes.push(quiz);
        break;
    }
  }
  setItem(QUIZ_KEY, allQuizzes);
  return allQuizzes;
};

export const deleteQuiz = (id: string): Quiz[] => {
  const quizzes = getAllQuizzes().filter((quiz) => quiz.id !== id);
  setItem(QUIZ_KEY, quizzes);
  return quizzes;
};
