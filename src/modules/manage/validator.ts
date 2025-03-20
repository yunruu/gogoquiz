import { Dispatch } from "react";
import { Question, Quiz } from "../../../be/types";
import { SetStateAction } from "react";


const isDuplicateQuestionTitle = (questions: Question[]) => {
    const titles = questions.map((q) => q.title);
    return new Set(titles).size !== titles.length;
};

export const validateForm = (setFormError: Dispatch<SetStateAction<string | undefined>>, newQuiz: Quiz, questions: Question[]) => {
    if (!newQuiz?.title) {
        setFormError('Title is required');
        return false;
    }

    if (!newQuiz?.description) {
        setFormError('Description is required');
        return false;
    }

    if (!questions || questions.length === 0) {
        setFormError('Questions are required');
        return false;
    }

    if (questions.some((q) => !q.title)) {
        setFormError('Questions must have a title');
        return false;
    }

    if (isDuplicateQuestionTitle(questions)) {
        setFormError('Questions must have unique titles');
        return false;
    }

    if (questions.some(q => !q.options || q.options.length <= 0)) {
        setFormError('Questions must have at least one option')
        return false
    }

    if (questions.some(q => q.options?.some(o => !o.text))) {
        setFormError('Question options must have text')
        return false
    }

    if (questions.some(q => q.options?.filter(o => o.isCorrect).length !== 1)) {
        setFormError('Question must have exactly one correct option')
        return false
    }

    if (questions.some(q => q.correctOption !== undefined && q.options && (q.correctOption < 0 || q.correctOption >= q.options.length))) {
        setFormError('Question correct option is invalid')
        return false
    }

    setFormError('');
    return true;
};
