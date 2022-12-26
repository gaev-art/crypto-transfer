import {toast} from 'react-toastify';

export const showToast = (message: string, type: string) => {
  const options = {
    position: 'bottom-left',
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: false,
    icon: false,
    type,
  };
  // @ts-ignore
  return toast(message, options);
};