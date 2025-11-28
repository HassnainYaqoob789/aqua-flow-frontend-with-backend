
import { useToastStore } from '../lib/store/toastStore';
import { ToastContextType } from '../lib/types/auth';

export const useToast = (): ToastContextType => {
  const addToast = useToastStore(state => state.addToast);

  return {
    showSuccess: (message: string, duration?: number) => {
      addToast(message, 'success', duration);
    },
    showError: (message: string, duration?: number) => {
      addToast(message, 'error', duration);
    },
    showWarning: (message: string, duration?: number) => {
      addToast(message, 'warning', duration);
    },
    showInfo: (message: string, duration?: number) => {
      addToast(message, 'info', duration);
    }
  };
};