import type { PropsWithChildren } from 'react';
import { useModalContext } from './ModalRoot';
import { cn } from '@/utils/cn';

interface ModalHeaderProps extends PropsWithChildren {
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  const { titleId } = useModalContext();

  return (
    <header id={titleId} className={cn('px-6 py-4 border-b border-gray-200', className)}>
      <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
    </header>
  );
}
