import { createPortal } from 'react-dom';
import type { PropsWithChildren } from 'react';

interface ModalPortalProps extends PropsWithChildren {
  container?: Element | null;
}

export function ModalPortal({ children, container = document.body }: ModalPortalProps) {
  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
