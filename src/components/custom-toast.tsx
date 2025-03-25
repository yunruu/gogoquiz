import { Slide, toast, ToastContainer } from 'react-toastify';
import { capitalizeFirst } from '@/utils/string';

export interface ICustomToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  error?: Error;
}

export const customToast = (message: string, options: ICustomToastOptions) => {
  if (options.error) {
    message = capitalizeFirst(`${message}: ${options.error.message}`);
    return toast(message, { type: 'error' });
  }
  return toast(capitalizeFirst(message), { type: options.type });
};

export default function CustomToast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
    />
  );
}
