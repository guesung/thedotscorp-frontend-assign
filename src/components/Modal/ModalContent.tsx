import { useEffect, type MouseEvent, type PropsWithChildren } from 'react';
import { useFocusTrap, getFocusableElements } from '@/hooks/useFocusTrap';
import { useKeyboardEvent } from '@/hooks/useKeyboardEvent';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useModalContext } from './ModalRoot';
import { cn } from '@/utils/cn';

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const { onClose, titleId, descriptionId, isAnimating, contentRef } = useModalContext();

  useFocusTrap(contentRef);
  useKeyboardEvent('Escape', onClose);
  useBodyScrollLock();

  useEffect(() => {
    if (!contentRef.current) return;

    const focusableElements = getFocusableElements(contentRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      contentRef.current.focus();
    }
  }, [contentRef]);

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className={cn(
        'bg-white rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none transition-opacity duration-200 ease-out',
        isAnimating ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
