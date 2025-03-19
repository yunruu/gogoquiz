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
import { getAllQuizzes } from '../../../be/quizzes';
import { Option, Question, Quiz } from '../../../be/types';
import { Cross1Icon } from '@radix-ui/react-icons';
import { getUuid } from '@/utils/randomiser';

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
      const data = await getAllQuizzes();
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

  const validateForm = () => {
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

    if (isDuplicateQuestionTitle()) {
      setFormError('Questions must have unique titles');
      return false;
    }

    setFormError('');
    return true;
  };

  const isDuplicateQuestionTitle = () => {
    const titles = questions.map((q) => q.title);
    return new Set(titles).size !== titles.length;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
  };

  const editForm = (key: 'title' | 'description', value: string) => {
    setNewQuiz((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const editQuestion = (key: 'title', value: string, questionId?: string) => {
    if (!questionId) return;

    setQuestions((prev) => {
      const updated = [...prev];

      if (updated[idx]) {
        updated[idx][key] = value;
      }
      return updated;
    });
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
                          editQuestion(question.id, 'title', newValue.target.value);
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
                          <Flex align="center" gap="2">
                            <TextField.Root
                              defaultValue={getOptionVal(0, question.options)}
                              onChange={(newValue) => {
                                handleOptionChange(idx, 0, newValue.target.value);
                              }}
                              placeholder="Input the option"
                            />
                            <RadioGroup.Item value="1">Correct</RadioGroup.Item>
                          </Flex>
                          <Flex align="center" gap="2">
                            <TextField.Root
                              defaultValue={getOptionVal(1, question.options)}
                              placeholder="Input the option"
                              onChange={(newValue) => {
                                handleOptionChange(idx, 1, newValue.target.value);
                              }}
                            />
                            <RadioGroup.Item value="2">Correct</RadioGroup.Item>
                          </Flex>
                          <Flex align="center" gap="2">
                            <TextField.Root
                              defaultValue={getOptionVal(2, question.options)}
                              placeholder="Input the option"
                              onChange={(newValue) => {
                                handleOptionChange(idx, 2, newValue.target.value);
                              }}
                            />
                            <RadioGroup.Item value="3">Correct</RadioGroup.Item>
                          </Flex>
                          <Flex align="center" gap="2">
                            <TextField.Root
                              defaultValue={getOptionVal(3, question.options)}
                              placeholder="Input the option"
                              onChange={(newValue) => {
                                handleOptionChange(idx, 3, newValue.target.value);
                              }}
                            />
                            <RadioGroup.Item value="4">Correct</RadioGroup.Item>
                          </Flex>
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
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>No. questions</Table.ColumnHeaderCell>
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
    </Box>
  );
}
