import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const ActionButton = ({ children, disabled, ...props }: ActionButtonProps) => {
  const { canEdit } = useAuth();
  
  return (
    <Button {...props} disabled={disabled || !canEdit()}>
      {children}
    </Button>
  );
};
