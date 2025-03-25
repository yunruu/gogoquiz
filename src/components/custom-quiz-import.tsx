import { Cross1Icon, UploadIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { useRef, useState } from 'react';
import { ImportType } from '../../be/types';

export interface ICustomFileUploadProps {
  onImport: (data: unknown, importTyp: ImportType) => void;
}
export default function CustomQuizImport({ onImport }: ICustomFileUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [importType, setImportType] = useState<ImportType>(ImportType.Overwrite);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string);
        onImport(parsedData, importType);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmDialog = (importType: ImportType) => {
    setIsDialogOpen(false);
    handleConfirmImport();
    setImportType(importType);
  };

  return (
    <div className="w-full">
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger>
          <div>
            <button
              className="flex items-center justify-center gap-5 cursor-pointer rounded hover:bg-violet-50 px-4 py-2 w-full"
              onClick={handleButtonClick}
            >
              <UploadIcon />
              <Text size="2">Import</Text>
            </button>
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Dialog.Trigger>
        <Dialog.Content
          maxWidth="500px"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <Flex width="100%" justify="between">
            <Dialog.Title>Import quiz</Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost">
                <Cross1Icon />
              </Button>
            </Dialog.Close>
          </Flex>
          <Dialog.Description className="hidden" size="2" mb="4">
            Import quiz confirmation dialog
          </Dialog.Description>
          <Text size="2" mb="4">
            Merge or overwrite quizzes with conflicting titles? Note that new quiz with conflicting ids will be ignored.
            This action cannot be undone.
          </Text>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="outline" onClick={() => handleConfirmDialog(ImportType.Overwrite)}>
                Overwrite
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={() => handleConfirmDialog(ImportType.Merge)}>Merge</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
