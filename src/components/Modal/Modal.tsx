import { ModalRoot } from "./ModalRoot";
import { ModalPortal } from "./ModalPortal";
import { ModalOverlay } from "./ModalOverlay";
import { ModalContent } from "./ModalContent";
import { ModalHeader } from "./ModalHeader";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalCloseButton } from "./ModalCloseButton";

export const Modal = Object.assign(ModalRoot, {
  Portal: ModalPortal,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
});

export default Modal;
