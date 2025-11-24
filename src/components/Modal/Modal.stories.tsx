import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Modal from "./Modal";

const meta: Meta = {
  title: "Components/Modal",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

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
          <Modal.Content>
            <Modal.Header>모달 제목</Modal.Header>
            <Modal.Body>
              <p className="text-gray-600">
                모달 본문 내용입니다. 여기에 원하는 콘텐츠를 넣을 수 있습니다.
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
        </Modal>
      </>
    );
  },
};

export const SlideAnimation: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Slide 모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content>
            <Modal.Header>Slide 애니메이션</Modal.Header>
            <Modal.Body>
              <p className="text-gray-600">
                이 모달은 위에서 아래로 슬라이드되며 나타납니다.
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
        </Modal>
      </>
    );
  },
};

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
          <Modal.Content className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative focus:outline-none transition-all duration-200 ease-out">
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
        </Modal>
      </>
    );
  },
};

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

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnOverlayClick={false}
        >
          <Modal.Content>
            <Modal.Header>중요 알림</Modal.Header>
            <Modal.Body>
              <p className="text-gray-600">
                이 모달은 배경을 클릭해도 닫히지 않습니다. 버튼을 클릭하거나 ESC
                키를 눌러야 닫힙니다.
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
        </Modal>
      </>
    );
  },
};

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
          <Modal.Content className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col focus:outline-none transition-all duration-200 ease-out">
            <Modal.Header>이용약관</Modal.Header>
            <Modal.Body className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-4 text-gray-600">
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris.
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
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로그인 모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Content>
            <Modal.Header>로그인</Modal.Header>
            <Modal.Body>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    비밀번호
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </form>
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
                로그인
              </button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </>
    );
  },
};
