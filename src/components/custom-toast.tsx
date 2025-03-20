import { Slide, toast, ToastContainer } from 'react-toastify';

export interface ICustomToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  error?: Error;
}

export const customToast = (message: string, options: ICustomToastOptions) => {
  if (options.error) {
    return toast(`${message}: ${options.error.message}`, { type: 'error' });
  }
  return toast(message, { type: options.type });
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
