import { useEffect } from 'react';

import { AlertCircle, CircleCheck, TriangleAlert, X } from 'lucide-react';

import { AlertDescription, Alert as UIAlert } from '@/components/ui/alert';

type AlertType = 'error' | 'warning' | 'success';

type AlertProps = {
  onClose: () => void;
  text: string;
  type: AlertType;
  autoCloseDuration?: number;
};

const ALERT_STYLES = {
  error: {
    border: 'border-red-900',
    text: 'text-red-300',
    bg: 'bg-red-950',
    iconColor: '#fca5a5',
    Icon: AlertCircle,
  },
  warning: {
    border: 'border-yellow-900',
    text: 'text-yellow-200',
    bg: 'bg-yellow-950',
    iconColor: '#fef0ba',
    Icon: TriangleAlert,
  },
  success: {
    border: 'border-green-900',
    text: 'text-green-300',
    bg: 'bg-green-950',
    iconColor: '#86EFAC',
    Icon: CircleCheck,
  },
};

export const Alert = ({ onClose, text, type, autoCloseDuration = 5000 }: AlertProps) => {
  useEffect(() => {
    if (autoCloseDuration) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration, onClose]);

  const { border, text: textColor, bg, iconColor, Icon } = ALERT_STYLES[type];

  return (
    <UIAlert
      className={`pt-3 fixed bottom-10 md:right-4 lg:right-4 md:translate-x-0 lg:translate-x-0 ${border} ${textColor} ${bg} w-[320px] md:w-[384px] lg:w-[384px] min-h-16 flex items-center justify-start left-1/2 transform -translate-x-1/2 md:left-auto lg:left-auto z-[500]`}
    >
      <div className="flex items-center">
        <Icon className="w-6 h-6 mt-[2px]" color={iconColor} />
        <AlertDescription className="ml-2 text-wrap w-[85%]">{text}</AlertDescription>
      </div>

      <button
        onClick={onClose}
        className={`absolute right-4 p-1 ${textColor} hover:${textColor.replace('300', '500')}`}
        aria-label="Fechar"
      >
        <X className="h-6 w-6" />
      </button>
    </UIAlert>
  );
};
