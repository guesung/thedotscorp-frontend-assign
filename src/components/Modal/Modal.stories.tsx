import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Modal from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 모달
export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Content>
                <Modal.Header>모달 제목</Modal.Header>
                <Modal.Body>
                  <p className="text-gray-600">
                    모달 본문 내용입니다. 여기에 원하는 콘텐츠를 넣을 수
                    있습니다.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    확인
                  </button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal.Portal>
        </Modal>
      </>
    );
  },
};

// 닫기 버튼이 있는 모달
export const WithCloseButton: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Content className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative focus:outline-none">
                <Modal.CloseButton />
                <Modal.Header>알림</Modal.Header>
                <Modal.Body>
                  <p className="text-gray-600">
                    오른쪽 상단의 X 버튼으로 닫을 수 있습니다.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    확인
                  </button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal.Portal>
        </Modal>
      </>
    );
  },
};

// 배경 클릭으로 닫히지 않는 모달
export const NoCloseOnOverlayClick: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Portal>
            <Modal.Overlay closeOnClick={false}>
              <Modal.Content>
                <Modal.Header>중요 알림</Modal.Header>
                <Modal.Body>
                  <p className="text-gray-600">
                    이 모달은 배경을 클릭해도 닫히지 않습니다. 버튼을 클릭하거나
                    ESC 키를 눌러야 닫힙니다.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    확인
                  </button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal.Portal>
        </Modal>
      </>
    );
  },
};

// 긴 내용의 모달
export const LongContent: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Content className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col focus:outline-none">
                <Modal.Header>이용약관</Modal.Header>
                <Modal.Body className="px-6 py-4 overflow-y-auto flex-1">
                  <div className="space-y-4 text-gray-600">
                    {Array.from({ length: 10 }, (_, i) => (
                      <p key={i}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris.
                      </p>
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    거절
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    동의
                  </button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal.Portal>
        </Modal>
      </>
    );
  },
};
