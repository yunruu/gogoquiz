import { Cross1Icon } from '@radix-ui/react-icons';
import { Button, Dialog, IconButton } from '@radix-ui/themes';
import { useState } from 'react';

export interface ICustomDialogOptions {
  triggerButtonText?: string;
  title: string;
  description: string;
  content: string;
  triggerButtonStyle?: 'primary' | 'secondary' | 'icon';
  triggerButtonIcon?: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning';
  error?: Error;
  onClose?: () => void;
  onConfirm?: (data: unknown) => void;
  primaryAction?: () => void;
  secondaryAction?: () => void;
  data?: unknown;
}

export default function CustomDialog(options: ICustomDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnConfirm = () => {
    if (options.onConfirm) {
      options.onConfirm(options.data);
    }
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        {options.triggerButtonIcon ? (
          <IconButton variant="ghost">{options.triggerButtonIcon}</IconButton>
        ) : (
          <Button>{options.triggerButtonText}</Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-between">
          <Dialog.Title>{options.title}</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost">
              <Cross1Icon />
            </IconButton>
          </Dialog.Close>
        </div>
        <Dialog.Description>{options.description}</Dialog.Description>
        <div>
          <p>{options.content}</p>
          <div className="flex justify-end gap-4">
            <Button onClick={handleOnConfirm}>Confirm</Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
