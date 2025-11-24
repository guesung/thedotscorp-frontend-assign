import type { PropsWithChildren } from 'react';
import { useModalContext } from './ModalRoot';
import { cn } from '@/utils/cn';

interface ModalBodyProps extends PropsWithChildren {
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  const { descriptionId } = useModalContext();

  return (
    <div id={descriptionId} className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}
