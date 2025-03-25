import { getItem, setItem } from "./service/storage";
import { Option, Question } from "./types";

const QUESTION_KEY = "question";

export const createQuestion = (id: string, title: string, options: Option[], correctOption: number): Question => {
    if (!id) { throw new Error("Question id required") }
    if (!title) { throw new Error("Question title required") }
    if (!options || options.length === 0) { throw new Error("Question options required") }
    if (correctOption < 0 || correctOption >= options.length) { throw new Error("Invalid correct option") }

    const newQuestion = new Question(id, title, options, correctOption);

    try {
        setItem(QUESTION_KEY, JSON.stringify([...getAllQuestions(), newQuestion]));
        return newQuestion;
    } catch (e) {
        throw new Error("Failed to create question");
    }
}

export const getAllQuestions = (): Question[] => {
    const questions = getItem(QUESTION_KEY);
    return questions ? JSON.parse(questions) : [];
}

export const getQuestion = (id: string): Question => {
    if (!id) { throw new Error("Question id required") }
    const q = getAllQuestions().find(q => q.id === id)
    if (!q) { throw new Error("Question not found") }
    return q;
}