'use client';

import { createQuiz, getQuizById, editQuiz } from '@/be/quizzes';
import { Option, Question, Quiz } from '@/be/types';
import { customToast } from '@/components/custom-toast';
import { getUuid } from '@/utils/randomiser';
import { Cross1Icon, Pencil2Icon } from '@radix-ui/react-icons';
import {
  Dialog,
  Button,
  Separator,
  ScrollArea,
  Flex,
  TextField,
  IconButton,
  RadioGroup,
  Badge,
  Text,
} from '@radix-ui/themes';
import { useState } from 'react';
import { validateForm } from './validator';

export interface IEditFormDialogProps {
  id: string;
  type: 'edit' | 'create';
  onSave: () => void;
}

const getOptionVal = (idx: number, options?: Option[]) => {
  if (!options) {
    return '';
  }
  return options[idx] ? options[idx].text : '';
};

const preventDialogCloseOnOutside = (event: CustomEvent) => {
  event.preventDefault();
};

export default function QuizFormDialog({ id, type, onSave }: IEditFormDialogProps) {
  const [newQuiz, setNewQuiz] = useState<Quiz>(new Quiz('', '', '', []));
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    {
      title: '',
      id: getUuid(),
    },
  ]);
  const [formError, setFormError] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTrigger = () => {
    setIsDialogOpen(true);
    if (type === 'edit') {
      const quiz = getQuizById(id);
      if (!quiz) return;
      setNewQuiz(quiz);
      setQuestions(quiz.questions);
    }
  };

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
      if (type === 'edit') {
        newQuiz.id = id;
        editQuiz(newQuiz as Quiz);
      } else {
        createQuiz(newQuiz as Quiz);
      }
      setIsDialogOpen(false);
      customToast(`${type} successful`, { type: 'success' });
      clearForm();
      onSave();
    } catch (e) {
      if (e instanceof Error) {
        customToast('Error creating quiz', { type: 'error', error: e });
      }
    }
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

  const clearForm = () => {
    setNewQuiz(new Quiz('', '', '', []));
    setQuestions([
      {
        title: '',
        id: getUuid(),
      },
    ]);
  };

  const renderTriggerButton = () => {
    if (type === 'edit') {
      return (
        <IconButton variant="ghost" onClick={handleTrigger}>
          <Pencil2Icon />
        </IconButton>
      );
    }
    return (
      <Button variant="outline" onClick={handleTrigger}>
        Create quiz
      </Button>
    );
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger>{renderTriggerButton()}</Dialog.Trigger>
      <Dialog.Content maxWidth={{ md: '900px', lg: '80vw' }} onInteractOutside={preventDialogCloseOnOutside}>
        <Dialog.Title className="capitalize">{type}</Dialog.Title>
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
                id={`${id}-quiz-title`}
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
                id={`${id}-quiz-description`}
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
                    id={`${question.id}-question-title`}
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
                            id={`${question.id}-option-${i}`}
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
  );
}
