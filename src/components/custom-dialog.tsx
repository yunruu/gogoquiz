import { Cross1Icon } from '@radix-ui/react-icons';
import { Button, Dialog, IconButton } from '@radix-ui/themes';

export interface ICustomDialogOptions {
  triggerButtonText?: string;
  title: string;
  description: string;
  content: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  triggerButtonStyle?: 'primary' | 'secondary' | 'icon';
  triggerButtonIcon?: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning';
  error?: Error;
  onClose?: () => void;
  onConfirm?: (data: unknown) => void;
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

export default function CustomDialog(options: ICustomDialogOptions) {
  return (
    <Dialog.Root open={options.isOpen} onOpenChange={options.onOpenChange}>
      <Dialog.Trigger>
        {options.triggerButtonIcon ? (
          <IconButton variant="ghost">{options.triggerButtonIcon}</IconButton>
        ) : (
          <Button>{options.triggerButtonText}</Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
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
            <Button onClick={options.onConfirm}>Confirm</Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
