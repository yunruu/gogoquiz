'use client';

import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Popover,
  RadioGroup,
  ScrollArea,
  Separator,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { createQuiz, deleteQuiz, getAllQuizzes, importQuizzes } from '@/be/quizzes';
import { ImportType, Option, Question, Quiz } from '@/be/types';
import { Cross1Icon, DownloadIcon, FileIcon, HamburgerMenuIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { getUuid } from '@/utils/randomiser';
import CustomToast, { customToast } from '@/components/custom-toast';
import { validateForm } from './validator';
import { exportJson } from '@/utils/data';
import CustomQuizImport from '@/components/custom-quiz-import';
import CustomDialog, { ICustomDialogOptions } from '@/components/custom-dialog';

const quizOverviewCols = ['Title', 'Description', 'No. questions', 'Action'];

const getOptionVal = (idx: number, options?: Option[]) => {
  if (!options) {
    return '';
  }
  return options[idx] ? options[idx].text : '';
};

export default function Manage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [newQuiz, setNewQuiz] = useState<Quiz>(new Quiz('', '', '', []));
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    {
      title: '',
      id: getUuid(),
    },
  ]);
  const [formError, setFormError] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const deleteDialogOptions: ICustomDialogOptions = {
    triggerButtonText: 'Delete',
    title: 'Delete quiz',
    description: 'Are you sure you want to delete this quiz?',
    content: '',
    triggerButtonStyle: 'icon',
    triggerButtonIcon: <TrashIcon />,
    type: 'warning',
    onConfirm: (data) => handleDeleteRow(data as string),
  };

  useEffect(() => {
    const fetchQuizzes = () => {
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
    if (!newQuiz) return;
    if (!validateForm(setFormError, newQuiz as Quiz, questions as Question[])) {
      return;
    }
    newQuiz.questions = questions as Question[];
    try {
      createQuiz(newQuiz as Quiz);
      setIsDialogOpen(false);
      customToast('Quiz created', { type: 'success' });
      refresh();
    } catch (e) {
      if (e instanceof Error) {
        customToast('Error creating quiz', { type: 'error', error: e });
      }
    }
  };

  const refresh = () => {
    setNewQuiz(new Quiz('', '', '', []));
    setQuestions([
      {
        title: '',
        id: getUuid(),
      },
    ]);
    setQuizzes(getAllQuizzes());
  };

  const editForm = (key: 'title' | 'description', value: string) => {
    setNewQuiz((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const editQuestion = (key: 'title', value: string, questionId?: string) => {
    if (!questionId) return;

    setQuestions((prev) =>
      prev.map((q) => {
        if (questionId === q.id) {
          q[key] = value;
        }
        return q;
      })
    );
  };

  const handleOptionChange = (optionIdx: number, value: string, questionIdx?: string) => {
    if (!questionIdx) return;

    setQuestions((prev) => {
      const updated = [...prev];
      const q = updated.find((q) => q.id === questionIdx);
      if (!q) return updated;
      if (!q.options) {
        q.options = [];
      }
      q.options[optionIdx] = {
        text: value,
      };
      return updated;
    });
  };

  const handleCorrectOptionRadioChange = (newValue: string, questionIdx?: string) => {
    if (!questionIdx) return;
    setQuestions((prev) => {
      const updated = [...prev];
      const q = updated.find((q) => q.id === questionIdx);
      if (!q) return updated;
      q.correctOption = parseInt(newValue) - 1;
      return updated;
    });
  };

  const deleteRow = (idx?: string) => {
    if (!idx) return;
    setQuestions(questions.filter((q) => q?.id !== idx));
  };

  const downloadQuizzes = () => {
    const filename = `${getFormattedDateTime()}_gogoquiz.json`;
    exportJson(quizzes, filename);
    setIsHamburgerOpen(false);
  };

  const getFormattedDateTime = () => {
    const now = new Date();

    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return `${dd}${mm}${yy}${hh}${min}`;
  };

  const importQuiz = (data: unknown, importType: ImportType) => {
    setIsHamburgerOpen(false);
    const importedQuizzes = data as Quiz[];
    if (!importedQuizzes) {
      customToast('Invalid data', { type: 'error' });
      return;
    }
    try {
      importQuizzes(importedQuizzes, importType);
      refresh();
    } catch (e) {
      if (e instanceof Error) {
        customToast('Error importing quizzes', { type: 'error', error: e });
      }
      return;
    }
    customToast('Imported quizzes', { type: 'success' });
  };

  const handleDeleteRow = (id: string) => {
    console.log('deleting', id);
    try {
      deleteQuiz(id);
      refresh();
      customToast('Quiz deleted', { type: 'success' });
    } catch (e) {
      if (e instanceof Error) {
        customToast('Error deleting quiz', { type: 'error', error: e });
      }
    }
  };

  return (
    <Box py="4">
      <Flex align="center" justify="end" mb="4" gap="4">
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                          onValueChange={(val) => handleCorrectOptionRadioChange(val, question.id)}
                        >
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Flex align="center" gap="2" key={i}>
                              <TextField.Root
                                defaultValue={getOptionVal(i, question.options)}
                                onChange={(newValue) => {
                                  handleOptionChange(i, newValue.target.value, question.id);
                                }}
                                placeholder="Input the option"
                              />
                              <RadioGroup.Item value={String(i + 1)}>Correct</RadioGroup.Item>
                            </Flex>
                          ))}
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
        <Popover.Root open={isHamburgerOpen} onOpenChange={setIsHamburgerOpen}>
          <Popover.Trigger>
            <IconButton size="3" variant="ghost">
              <HamburgerMenuIcon />
            </IconButton>
          </Popover.Trigger>
          <Popover.Content className="!p-2">
            <div className="flex flex-col gap-1">
              <button
                className="flex items-center justify-center gap-5 cursor-pointer rounded hover:bg-violet-50 px-4 py-2 w-full"
                onClick={downloadQuizzes}
              >
                <DownloadIcon />
                <Text size="2">Download</Text>
              </button>
              <CustomQuizImport onImport={importQuiz} />
            </div>
          </Popover.Content>
        </Popover.Root>
      </Flex>
      {quizzes.length > 0 ? (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              {quizOverviewCols.map((col) => (
                <Table.ColumnHeaderCell key={col}>{col}</Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {quizzes.map((quiz) => (
              <Table.Row key={quiz.id}>
                <Table.RowHeaderCell>{quiz.title}</Table.RowHeaderCell>
                <Table.Cell>{quiz.description}</Table.Cell>
                <Table.Cell>{quiz.questions.length}</Table.Cell>
                <Table.Cell width="10%">
                  <div className="flex gap-4">
                    <IconButton variant="ghost">
                      <Pencil2Icon />
                    </IconButton>
                    <CustomDialog {...deleteDialogOptions} data={quiz.id} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <div className="max-w-64 md:max-w-full flex flex-col justify-center items-center mt-12 h-20 gap-2 m-auto">
          <FileIcon color="gray" />
          <Text color="gray" align="center">
            No quizzes available. Create one or import a Quiz file!
          </Text>
        </div>
      )}
      <CustomToast />
    </Box>
  );
}
