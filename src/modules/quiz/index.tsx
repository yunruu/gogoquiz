'use client';

import { Badge, Box, Button, Card, Dialog, Flex, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { Option, Question, Quiz } from '@/be/types';
import { getAllQuizzes } from '@/be/quizzes';
import { shuffleArray } from '@/utils/randomiser';
import Image from 'next/image';

export interface ISessionControl {
  hasSessionStarted: boolean;
  totalQuestions: number;
  correctAnswers: number;
  quiz?: Quiz;
}

const isSelectedOptionCorrect = (optionIdx: number, correctIdx: number) => {
  return optionIdx === correctIdx;
};

export default function QuizPage() {
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [sessionControl, setSessionControl] = useState<ISessionControl>({
    hasSessionStarted: false,
    totalQuestions: 0,
    correctAnswers: 0,
  });
  const [randomQuestions, setRandomQuestions] = useState<Question[]>([]);
  const [currQuestion, setCurrQuestion] = useState<Question>();
  const [selectedOption, setSelectedOption] = useState<Option>();
  const [isQuizEnd, setIsQuizEnd] = useState(false);

  const selectQuiz = (quiz: Quiz) => {
    setSessionControl({ ...sessionControl, quiz: quiz });
  };

  const isSelectedQuiz = (quiz: Quiz) => {
    return sessionControl.quiz?.id === quiz.id;
  };

  const selectedQuizStyles = (quiz: Quiz) => {
    return isSelectedQuiz(quiz) ? 'bg-violet-100 border border-violet-600' : '';
  };

  const getNextQuestion = () => {
    const nextQuestion = randomQuestions.pop();
    setCurrQuestion(nextQuestion);
    setSelectedOption(undefined);
  };

  const startQuiz = () => {
    if (!sessionControl.quiz) return;
    setSessionControl({ ...sessionControl, hasSessionStarted: true });
    const questions = shuffleArray(sessionControl.quiz.questions);
    setSessionControl({ ...sessionControl, totalQuestions: questions.length });
    const firstQuestion = questions.pop();
    setRandomQuestions(questions);
    setCurrQuestion(firstQuestion);
  };

  const endQuiz = () => {
    setSessionControl({ hasSessionStarted: false, totalQuestions: 0, correctAnswers: 0 });
    setCurrQuestion(undefined);
    setRandomQuestions([]);
    setSelectedOption(undefined);
    setIsQuizEnd(false);
  };

  const handleSelectAnswer = (selectedOption: Option, optionIdx: number, correctOptionIdx: number) => {
    setSelectedOption(selectedOption);
    if (isSelectedOptionCorrect(optionIdx, correctOptionIdx)) {
      setSessionControl({ ...sessionControl, correctAnswers: sessionControl.correctAnswers + 1 });
    }
    if (randomQuestions.length === 0) {
      setIsQuizEnd(true);
    }
  };

  const isOptionSelected = (option: Option) => {
    if (!selectedOption) return false;
    return selectedOption.text === option.text;
  };

  const selectedOptionStyle = (option: Option, optionIdx: number, correctOptionIdx: number) => {
    return isOptionSelected(option)
      ? isSelectedOptionCorrect(optionIdx, correctOptionIdx)
        ? 'bg-green-200 border-green-600 hover:bg-green-200'
        : 'reset bg-rose-200 border-rose-600 hover:bg-rose-200'
      : selectedOption
      ? 'border-gray-200 bg-gray-100'
      : 'border-violet-200 hover:bg-violet-100 active:bg-violet-200';
  };

  useEffect(() => {
    const fetchQuizzes = () => {
      const res = getAllQuizzes();
      setAllQuizzes(res);
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <div className="flex flex-row-reverse">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button disabled={!sessionControl.quiz} onClick={startQuiz}>
              Start quiz
            </Button>
          </Dialog.Trigger>
          <Dialog.Content
            maxWidth={{ md: '900px', lg: '80vw' }}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <Dialog.Title mb="2">{sessionControl.quiz?.title}</Dialog.Title>
            <Dialog.Description size="2" mb="4" hidden={true}>
              Start quiz!
            </Dialog.Description>
            <Separator my="3" size="4" />
            <Flex direction="column" gap="3">
              <ScrollArea type="auto" scrollbars="vertical" style={{ height: 400 }}>
                <Box>
                  <Flex gap="3" align="center" mt="1" mb="4">
                    <Badge size="3" color="violet">
                      Question
                    </Badge>
                    <Text>{currQuestion?.title}</Text>
                  </Flex>
                  <Flex gap="3" direction="column">
                    {currQuestion?.options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${selectedOptionStyle(
                          option,
                          idx,
                          currQuestion.correctOption
                        )}`}
                        onClick={() => handleSelectAnswer(option, idx, currQuestion.correctOption)}
                        disabled={!!selectedOption}
                      >
                        <Flex gap="2" align="center">
                          {option.image && (
                            <Image src={option.image} alt={option.text} style={{ width: 50, height: 50 }} />
                          )}
                          <Text as="div" size="2" color="gray">
                            {option.text}
                          </Text>
                        </Flex>
                      </button>
                    ))}
                  </Flex>
                </Box>
              </ScrollArea>
            </Flex>
            <Flex gap="3" mt="4" justify="end" align="center">
              {randomQuestions.length > 0 && <Button onClick={getNextQuestion}>Next</Button>}
              {isQuizEnd && (
                <Badge
                  size="3"
                  color={sessionControl.correctAnswers === sessionControl.totalQuestions ? 'green' : 'ruby'}
                >
                  Score: {sessionControl.correctAnswers} of {sessionControl.totalQuestions} correct
                </Badge>
              )}
              <Dialog.Close>
                <Button color="ruby" onClick={endQuiz}>
                  End quiz
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allQuizzes.map((quiz) => (
          <Box key={quiz.id}>
            <Card
              onClick={() => selectQuiz(quiz)}
              className={`cursor-pointer hover:bg-violet-100 active:bg-violet-300 ${selectedQuizStyles(quiz)}`}
            >
              <Flex gap="2" align="center">
                <Box>
                  <Text as="div" size="4" weight="bold" color="violet">
                    {quiz.title}
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {quiz.description}
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Box>
        ))}
      </div>
    </div>
  );
}
