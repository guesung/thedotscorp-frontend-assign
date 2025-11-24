import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import Modal from './Modal';

function getDialog() {
  return document.querySelector('[role="dialog"]') as HTMLElement | null;
}

describe('Modal', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('열기/닫기 제어', () => {
    it('모달이 isOpen={true}일 때 렌더링되어야 함', async () => {
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(dialog).toHaveClass('opacity-100');
        },
        { timeout: 300 },
      );

      expect(screen.getByText('테스트 모달')).toBeInTheDocument();
      expect(screen.getByText('모달 내용')).toBeInTheDocument();
    });

    it('모달이 isOpen={false}일 때 렌더링되지 않아야 함', () => {
      const onClose = vi.fn();

      render(
        <Modal isOpen={false} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('닫기 버튼을 누르면 onClose 콜백이 호출되어야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(true);

        const handleClose = () => {
          onClose();
          setIsOpen(false);
        };

        return (
          <Modal isOpen={isOpen} onClose={handleClose}>
            <Modal.Content>
              <Modal.Header>테스트 모달</Modal.Header>
              <Modal.Body>
                <button onClick={handleClose}>닫기</button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        );
      }

      render(<TestModal />);

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      const closeButton = within(dialog!).getByText('닫기').closest('button')!;
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);

      await waitFor(
        () => {
          expect(getDialog()).not.toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });

    it('외부 상태로 모달을 제어할 수 있어야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>모달 내용</Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      expect(getDialog()).not.toBeInTheDocument();

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(dialog).toHaveClass('opacity-100');
        },
        { timeout: 300 },
      );

      await user.keyboard('{Escape}');

      await waitFor(
        () => {
          expect(getDialog()).not.toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });
  });

  describe('ESC 키 및 배경 클릭', () => {
    it('ESC 키로 모달을 닫을 수 있어야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('배경(overlay) 클릭으로 모달을 닫을 수 있어야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      const overlay = dialog?.parentElement;
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        await user.click(overlay);
      }

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('closeOnOverlayClick={false}일 때 배경 클릭으로 닫히지 않아야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      const overlay = dialog?.parentElement;
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        await user.click(overlay);
      }

      await waitFor(() => {
        expect(onClose).not.toHaveBeenCalled();
      });

      expect(getDialog()).toBeInTheDocument();
    });

    it('모달 콘텐츠 클릭 시 모달이 닫히지 않아야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      await user.click(dialog!);

      expect(onClose).not.toHaveBeenCalled();
      expect(getDialog()).toBeInTheDocument();
    });

    it('closeOnOverlayClick={false}일 때도 ESC 키는 작동해야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('포커스 관리 및 포커스 트랩', () => {
    it('모달이 열릴 때 첫 번째 포커스 가능한 요소에 포커스가 이동해야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>
                  <button>첫 번째 버튼</button>
                  <button>두 번째 버튼</button>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      await waitFor(
        () => {
          const firstButton = within(dialog!).getByText('첫 번째 버튼').closest('button')!;
          expect(firstButton).toHaveFocus();
        },
        { timeout: 500 },
      );
    });

    it('포커스 가능한 요소가 없을 때 모달 콘텐츠에 포커스가 이동해야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>모달 내용 (버튼 없음)</Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(dialog).toHaveFocus();
        },
        { timeout: 300 },
      );
    });

    it('Tab 키로 포커스가 모달 내부에서 순환해야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>
                  <button>첫 번째 버튼</button>
                  <button>두 번째 버튼</button>
                  <button>세 번째 버튼</button>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      await waitFor(
        () => {
          const firstButton = within(dialog!).getByText('첫 번째 버튼').closest('button')!;
          expect(firstButton).toHaveFocus();
        },
        { timeout: 500 },
      );

      await user.tab();
      const secondButton = within(dialog!).getByText('두 번째 버튼').closest('button')!;
      expect(secondButton).toHaveFocus();

      await user.tab();
      const thirdButton = within(dialog!).getByText('세 번째 버튼').closest('button')!;
      expect(thirdButton).toHaveFocus();

      await user.tab();
      const firstButtonAgain = within(dialog!).getByText('첫 번째 버튼').closest('button')!;
      expect(firstButtonAgain).toHaveFocus();
    });

    it('Shift+Tab 키로 포커스가 역순으로 순환해야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>
                  <button>첫 번째 버튼</button>
                  <button>두 번째 버튼</button>
                  <button>세 번째 버튼</button>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      await waitFor(
        () => {
          const firstButton = within(dialog!).getByText('첫 번째 버튼').closest('button')!;
          expect(firstButton).toHaveFocus();
        },
        { timeout: 500 },
      );

      await user.tab({ shift: true });
      const thirdButton = within(dialog!).getByText('세 번째 버튼').closest('button')!;
      expect(thirdButton).toHaveFocus();

      await user.tab({ shift: true });
      const secondButton = within(dialog!).getByText('두 번째 버튼').closest('button')!;
      expect(secondButton).toHaveFocus();
    });

    it('모달이 닫힐 때 이전 활성 요소로 포커스가 돌아가야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>
                  <button>모달 내부 버튼</button>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      openButton.focus();
      expect(openButton).toHaveFocus();

      await user.click(openButton);

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      await user.keyboard('{Escape}');

      await waitFor(
        () => {
          expect(openButton).toHaveFocus();
        },
        { timeout: 300 },
      );
    });
  });

  describe('ARIA 속성', () => {
    it('ModalContent에 role="dialog"가 있어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });

    it('ModalContent에 aria-modal="true"가 있어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toHaveAttribute('aria-modal', 'true');
        },
        { timeout: 300 },
      );
    });

    it('ModalContent의 aria-labelledby가 ModalHeader의 id를 가리켜야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const header = screen.getByText('테스트 모달').closest('header');

          expect(header).toHaveAttribute('id');
          const headerId = header?.getAttribute('id');
          expect(dialog).toHaveAttribute('aria-labelledby', headerId);
        },
        { timeout: 300 },
      );
    });

    it('ModalContent의 aria-describedby가 ModalBody의 id를 가리켜야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const body = screen.getByText('모달 내용').closest('div');

          expect(body).toHaveAttribute('id');
          const bodyId = body?.getAttribute('id');
          expect(dialog).toHaveAttribute('aria-describedby', bodyId);
        },
        { timeout: 300 },
      );
    });

    it('Overlay에 aria-hidden="true"가 있어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const overlay = dialog?.parentElement;
          expect(overlay).toHaveAttribute('aria-hidden', 'true');
        },
        { timeout: 300 },
      );
    });

    it('CloseButton에 aria-label="닫기"가 있어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const closeButton = within(dialog!).getByLabelText('닫기');
          expect(closeButton).toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });
  });

  describe('애니메이션', () => {
    it('모달이 열릴 때 isAnimating 상태가 올바르게 전환되어야 함', async () => {
      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>모달 내용</Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await act(async () => {
        openButton.click();
      });

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(dialog).toHaveClass('opacity-100');
        },
        { timeout: 300 },
      );
    });

    it('모달 콘텐츠에 올바른 transition 클래스가 적용되어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toHaveClass('transition-opacity', 'duration-200', 'ease-out');
        },
        { timeout: 300 },
      );
    });

    it('오버레이에 올바른 transition 클래스가 적용되어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const overlay = dialog?.parentElement;
          expect(overlay).toHaveClass('transition-opacity', 'duration', 'ease-out');
        },
        { timeout: 300 },
      );
    });

    it('모달이 닫힌 후 200ms 후에 언마운트되어야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(true);

        return (
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Content>
              <Modal.Header>테스트 모달</Modal.Header>
              <Modal.Body>모달 내용</Modal.Body>
            </Modal.Content>
          </Modal>
        );
      }

      render(<TestModal />);

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      await user.keyboard('{Escape}');

      expect(getDialog()).toBeInTheDocument();

      await waitFor(
        () => {
          expect(getDialog()).not.toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });
  });

  describe('바디 스크롤 잠금', () => {
    it('모달이 열릴 때 document.body.style.overflow가 "hidden"으로 설정되어야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>테스트 모달</Modal.Header>
                <Modal.Body>모달 내용</Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('모달이 닫힐 때 document.body.style.overflow가 복원되어야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(true);

        return (
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Content>
              <Modal.Header>테스트 모달</Modal.Header>
              <Modal.Body>모달 내용</Modal.Body>
            </Modal.Content>
          </Modal>
        );
      }

      render(<TestModal />);

      expect(document.body.style.overflow).toBe('hidden');

      await user.keyboard('{Escape}');

      await waitFor(
        () => {
          expect(document.body.style.overflow).toBe('');
        },
        { timeout: 300 },
      );
    });
  });

  describe('포털 렌더링', () => {
    it('모달이 document.body에 포털로 렌더링되어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(dialog?.closest('body')).toBe(document.body);
        },
        { timeout: 300 },
      );
    });

    it('custom portalContainer prop이 작동해야 함', async () => {
      const customContainer = document.createElement('div');
      customContainer.id = 'custom-portal';
      document.body.appendChild(customContainer);

      render(
        <Modal isOpen={true} onClose={vi.fn()} portalContainer={customContainer}>
          <Modal.Content>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(dialog?.closest('#custom-portal')).toBe(customContainer);
        },
        { timeout: 300 },
      );

      document.body.removeChild(customContainer);
    });
  });

  describe('닫기 버튼', () => {
    it('CloseButton 클릭 시 onClose가 호출되어야 함', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      const closeButton = within(dialog!).getByLabelText('닫기');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('CloseButton이 기본적으로 아이콘을 렌더링해야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const closeButton = within(dialog!).getByLabelText('닫기');
          expect(closeButton.querySelector('svg')).toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });

    it('CloseButton이 커스텀 children을 렌더링할 수 있어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.CloseButton>닫기 텍스트</Modal.CloseButton>
            <Modal.Header>테스트 모달</Modal.Header>
            <Modal.Body>모달 내용</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          const closeButton = within(dialog!).getByLabelText('닫기');
          expect(closeButton).toHaveTextContent('닫기 텍스트');
        },
        { timeout: 300 },
      );
    });
  });

  describe('컴포넌트 통합', () => {
    it('전체 모달 구조(Header, Body, Footer, CloseButton)가 올바르게 렌더링되어야 함', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>모달 제목</Modal.Header>
            <Modal.Body>모달 본문</Modal.Body>
            <Modal.Footer>
              <button>취소</button>
              <button>확인</button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>,
      );

      await waitFor(
        () => {
          const dialog = getDialog();
          expect(dialog).toBeInTheDocument();
          expect(within(dialog!).getByLabelText('닫기')).toBeInTheDocument();
          expect(screen.getByText('모달 제목')).toBeInTheDocument();
          expect(screen.getByText('모달 본문')).toBeInTheDocument();
          expect(within(dialog!).getByText('취소').closest('button')).toBeInTheDocument();
          expect(within(dialog!).getByText('확인').closest('button')).toBeInTheDocument();
        },
        { timeout: 300 },
      );
    });

    it('폼 요소가 있는 모달에서 포커스 트랩이 작동해야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>로그인</Modal.Header>
                <Modal.Body>
                  <form>
                    <input type="email" placeholder="이메일" />
                    <input type="password" placeholder="비밀번호" />
                    <button type="submit">로그인</button>
                  </form>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      await waitFor(() => {
        const emailInput = within(dialog!).getByPlaceholderText('이메일');
        expect(emailInput).toHaveFocus();
      });

      await user.tab();
      const passwordInput = within(dialog!).getByPlaceholderText('비밀번호');
      expect(passwordInput).toHaveFocus();

      await user.tab();
      const form = dialog!.querySelector('form');
      const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveFocus();

      await user.tab();
      const emailInputAgain = within(dialog!).getByPlaceholderText('이메일');
      expect(emailInputAgain).toHaveFocus();
    });

    it('여러 버튼이 있는 모달에서 Tab 네비게이션이 작동해야 함', async () => {
      const user = userEvent.setup();

      function TestModal() {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <Modal.Content>
                <Modal.Header>확인</Modal.Header>
                <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
                <Modal.Footer>
                  <button>취소</button>
                  <button>삭제</button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </>
        );
      }

      render(<TestModal />);

      const openButton = screen.getByRole('button', { name: '모달 열기' });
      await user.click(openButton);

      await waitFor(
        () => {
          expect(getDialog()).toBeInTheDocument();
        },
        { timeout: 300 },
      );

      const dialog = getDialog();
      await waitFor(
        () => {
          const cancelButton = within(dialog!).getByText('취소').closest('button')!;
          expect(cancelButton).toHaveFocus();
        },
        { timeout: 500 },
      );

      await user.tab();
      const deleteButton = within(dialog!).getByText('삭제').closest('button')!;
      expect(deleteButton).toHaveFocus();

      await user.tab();
      const cancelButtonAgain = within(dialog!).getByText('취소').closest('button')!;
      expect(cancelButtonAgain).toHaveFocus();
    });
  });
});
