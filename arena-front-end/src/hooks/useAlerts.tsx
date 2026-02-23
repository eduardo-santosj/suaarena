'use client';
import { Alert } from '@/components/Alert';
import { createContext, ReactNode, useContext, useState } from 'react';

type AlertType = 'success' | 'error' | 'warning';

type AlertContextType = {
  show: (type: AlertType, message: string) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const show = (type: AlertType, message: string) => setAlert({ type, message });

  const handleClose = () => setAlert(null);
  
  return (
    <AlertContext.Provider value={{ show }}>
      {children}
      {alert && <Alert type={alert.type} text={alert.message} onClose={handleClose} />}
    </AlertContext.Provider>
  )
}
