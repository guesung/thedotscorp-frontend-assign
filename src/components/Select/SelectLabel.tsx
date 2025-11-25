import type { PropsWithChildren } from 'react';
import { useSelectContext } from './SelectRoot';
import { cn } from '@/utils/cn';

interface SelectLabelProps extends PropsWithChildren {
  className?: string;
}

export function SelectLabel({ children, className }: SelectLabelProps) {
  const { labelId, variant } = useSelectContext();

  return (
    <label
      id={labelId}
      className={cn('block mb-1 text-sm font-medium', variant === 'disabled' ? 'text-gray-400' : 'text-gray-700', className)}
    >
      {children}
    </label>
  );
}
