'use client';

import { Box, Flex, IconButton, Popover, Table, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { deleteQuiz, getAllQuizzes, importQuizzes } from '@/be/quizzes';
import { ImportType, Quiz } from '@/be/types';
import { DownloadIcon, FileIcon, HamburgerMenuIcon, TrashIcon } from '@radix-ui/react-icons';
import CustomToast, { customToast } from '@/components/custom-toast';
import { exportJson } from '@/utils/data';
import CustomQuizImport from '@/components/custom-quiz-import';
import CustomDialog, { ICustomDialogOptions } from '@/components/custom-dialog';
import QuizFormDialog from './quiz-form-dialog';

const quizOverviewCols = ['Title', 'Description', 'No. questions', 'Action'];

export default function Manage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
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

  const refresh = () => {
    setQuizzes(getAllQuizzes());
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
        <QuizFormDialog id="" type="create" onSave={refresh} />
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
                    <QuizFormDialog id={quiz.id} type="edit" onSave={refresh} />
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
