'use client';

import { Box, Card, Flex, Text } from '@radix-ui/themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Quiz } from '../../../be/types';
import { getAllQuizzes } from '../../../be/quizzes';

export default function QuizPage() {
  const router = useRouter();
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);

  const startSession = (id: string) => {
    router.push({
      pathname: '/session/[id]',
      query: {
        id: id,
      },
    });
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await getAllQuizzes();
      setAllQuizzes(res);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="mt-2 grid grid-cols-3 gap-4">
      {allQuizzes.map((quiz) => (
        <Box key={quiz.title}>
          <Card
            onClick={() => startSession(quiz.id)}
            className="cursor-pointer hover:bg-violet-100 active:bg-violet-300"
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
  );
}
