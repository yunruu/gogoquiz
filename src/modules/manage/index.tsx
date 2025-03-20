import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  RadioGroup,
  ScrollArea,
  Separator,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { createQuiz, getAllQuizzes } from '../../../be/quizzes';
import { Option, Question, Quiz } from '../../../be/types';
import { Cross1Icon } from '@radix-ui/react-icons';
import { getUuid } from '@/utils/randomiser';
import { toast } from 'react-toastify';
import CustomToast from '@/components/custom-toast';
import { validateForm } from './validator';

const quizOverviewCols = ["Title", "Description", "No. questions"]

export default function Manage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>();
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    {
      title: '',
      id: getUuid(),
    },
  ]);
  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = getAllQuizzes();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  const handleAddNewQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        title: '',
        id: getUuid(),
      },
    ]);
  };

  const handleSave = () => {
    toast('Error creating quiz', { type: 'error' });

    if (!validateForm(setFormError, newQuiz as Quiz, questions as Question[])) {
      return;
    }
    try {
      const res = createQuiz(newQuiz as Quiz);
      refresh();
    } catch (e) {
      toast('Error creating quiz', { type: 'error' });
    }
  };

  const refresh = () => {
    setNewQuiz(undefined);
    setQuestions([
      {
        title: '',
        id: getUuid(),
      },
    ]);
    setQuizzes(getAllQuizzes());
  }

  const editForm = (key: 'title' | 'description', value: string) => {
    setNewQuiz((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const editQuestion = (key: 'title', value: string, questionId?: string) => {
    if (!questionId) return;

    setQuestions((prev) =>
      prev.map(q => {
        if (questionId === q.id) {
          q[key] = value
        }
        return q
      })
    );
  };

  const getOptionVal = (idx: number, options?: Option[]) => {
    if (!options) {
      return '';
    }
    return options[idx] ? options[idx].text : '';
  };

  const handleOptionChange = (questionIdx: number, optionIdx: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[questionIdx]) {
        if (!updated[questionIdx].options) {
          updated[questionIdx].options = [];
        }
        updated[questionIdx].options[optionIdx] = {
          text: value,
          isCorrect: false,
        };
      }
      return updated;
    });
  };

  const handleCorrectOptionRadioChange = (newValue: string, questionIdx: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[questionIdx]) {
        updated[questionIdx].correctOption = parseInt(newValue) - 1;
      }
      return updated;
    });
  };

  const deleteRow = (idx?: string) => {
    if (!idx) return;
    setQuestions(questions.filter((q) => q?.id !== idx));
  };

  return (
    <Box py="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="4" ml="1">
          Manage quiz
        </Heading>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="outline">Create quiz</Button>
          </Dialog.Trigger>

          <Dialog.Content
            maxWidth={{ md: '900px', lg: '80vw' }}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <Dialog.Title>Create quiz</Dialog.Title>
            <Dialog.Description size="2" mb="4" hidden={true}>
              Add a new quiz!
            </Dialog.Description>
            <Separator my="3" size="4" />

            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '60vh' }}>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold" mt="3">
                    Title
                  </Text>
                  <TextField.Root
                    defaultValue={newQuiz?.title}
                    placeholder="Input the quiz title"
                    onChange={(newValue) => editForm('title', newValue.target.value)}
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Description
                  </Text>
                  <TextField.Root
                    defaultValue={newQuiz?.description}
                    placeholder="Input the quiz description"
                    onChange={(newValue) => editForm('description', newValue.target.value)}
                  />
                </label>
                <Flex gap="3" align="center" justify="between" my="1">
                  <Text as="div" size="2" weight="bold">
                    Questions
                  </Text>
                  <Button variant="soft" onClick={handleAddNewQuestion}>
                    New question
                  </Button>
                </Flex>

                {questions.map((question, idx) => (
                  <div
                    key={question.id || idx}
                    className="flex flex-col gap-3 p-5 mb-4 border border-zinc-200 rounded-xl shadow-md"
                  >
                    <div className="flex flex-row-reverse z-50">
                      <IconButton variant="ghost" onClick={() => deleteRow(question.id)}>
                        <Cross1Icon />
                      </IconButton>
                    </div>
                    <label>
                      <Text as="div" size="2" mb="1" mt="-5" weight="bold">
                        Title
                      </Text>
                      <TextField.Root
                        defaultValue={question.title}
                        placeholder="Input the question title"
                        onChange={(newValue) => {
                          editQuestion('title', newValue.target.value, question.id);
                        }}
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Options
                      </Text>
                      <Flex direction="column" gap="2">
                        <RadioGroup.Root
                          defaultValue={String((question.correctOption ?? 0) + 1)}
                          aria-label="Options"
                          onValueChange={(val) => handleCorrectOptionRadioChange(val, idx)}
                        >
                          {
                            Array.from({ length: 4 }).map((_, i) => (
                              <Flex align="center" gap="2" key={i}>
                                <TextField.Root
                                  defaultValue={getOptionVal(i, question.options)}
                                  onChange={(newValue) => {
                                    handleOptionChange(idx, i, newValue.target.value);
                                  }}
                                  placeholder="Input the option"
                                />
                                <RadioGroup.Item value={String(i + 1)}>Correct</RadioGroup.Item>
                              </Flex>
                            ))
                          }
                        </RadioGroup.Root>
                      </Flex>
                    </label>
                  </div>
                ))}
              </Flex>
            </ScrollArea>

            <Flex gap="3" mt="4" justify="end" align="center">
              {formError && (
                <Badge size="3" color="red">
                  Error: {formError}!
                </Badge>
              )}
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleSave}>Save</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {
              quizOverviewCols.map(col => (
                <Table.ColumnHeaderCell key={col}>{col}</Table.ColumnHeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {quizzes.map((quiz) => (
            <Table.Row key={quiz.id}>
              <Table.RowHeaderCell>{quiz.title}</Table.RowHeaderCell>
              <Table.Cell>{quiz.description}</Table.Cell>
              <Table.Cell>{quiz.questions.length}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <CustomToast />
    </Box>
  );
}
