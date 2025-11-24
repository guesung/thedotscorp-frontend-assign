import { ModalRoot } from './ModalRoot';
import { ModalContent } from './ModalContent';
import { ModalHeader } from './ModalHeader';
import { ModalBody } from './ModalBody';
import { ModalFooter } from './ModalFooter';
import { ModalCloseButton } from './ModalCloseButton';

export const Modal = Object.assign(ModalRoot, {
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
});

export default Modal;
