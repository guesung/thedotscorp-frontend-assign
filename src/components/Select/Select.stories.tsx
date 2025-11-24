import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Select from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

function DefaultExample() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select variant="default" value={value} onChange={setValue}>
      <Select.Label>과일 선택</Select.Label>
      <Select.Trigger>선택하세요</Select.Trigger>
      <Select.List>
        <Select.Option value="apple">사과</Select.Option>
        <Select.Option value="banana">바나나</Select.Option>
        <Select.Option value="orange">오렌지</Select.Option>
      </Select.List>
    </Select>
  );
}

export const Default: Story = {
  render: () => <DefaultExample />,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: false,
        iframeHeight: 250,
      },
    },
  },
};

function DisabledExample() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select variant="disabled" value={value} onChange={setValue}>
      <Select.Label>과일 선택</Select.Label>
      <Select.Trigger>선택하세요</Select.Trigger>
      <Select.List>
        <Select.Option value="apple">사과</Select.Option>
        <Select.Option value="banana">바나나</Select.Option>
        <Select.Option value="orange">오렌지</Select.Option>
      </Select.List>
    </Select>
  );
}

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

function DisabledOptionExample() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select value={value} onChange={setValue}>
      <Select.Label>과일 선택 (일부 품절)</Select.Label>
      <Select.Trigger>선택하세요</Select.Trigger>
      <Select.List>
        <Select.Option value="apple">사과</Select.Option>
        <Select.Option value="banana" disabled>
          바나나 (품절)
        </Select.Option>
        <Select.Option value="orange">오렌지</Select.Option>
        <Select.Option value="grape" disabled>
          포도 (품절)
        </Select.Option>
        <Select.Option value="mango">망고</Select.Option>
      </Select.List>
    </Select>
  );
}

export const DisabledOption: Story = {
  render: () => <DisabledOptionExample />,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: false,
        iframeHeight: 300,
      },
    },
  },
};

function GroupedOptionsExample() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select value={value} onChange={setValue}>
      <Select.Label>음식 선택</Select.Label>
      <Select.Trigger>선택하세요</Select.Trigger>
      <Select.List maxHeight="20rem">
        <Select.Group label="과일">
          <Select.Option value="apple">
            사과 <span className="text-red-500 text-xs">인기</span>
          </Select.Option>
          <Select.Option value="banana">바나나</Select.Option>
          <Select.Option value="orange">오렌지</Select.Option>
        </Select.Group>
        <Select.Group label="채소">
          <Select.Option value="carrot">당근</Select.Option>
          <Select.Option value="broccoli" disabled>
            브로콜리 (품절)
          </Select.Option>
          <Select.Option value="spinach">
            시금치 <span className="text-green-500 text-xs">신선</span>
          </Select.Option>
        </Select.Group>
        <Select.Group label="육류">
          <Select.Option value="beef">소고기</Select.Option>
          <Select.Option value="pork">돼지고기</Select.Option>
          <Select.Option value="chicken">닭고기</Select.Option>
        </Select.Group>
      </Select.List>
    </Select>
  );
}

export const GroupedOptions: Story = {
  render: () => <GroupedOptionsExample />,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: false,
        iframeHeight: 450,
      },
    },
  },
};

function ColoredTextOptionExample() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select value={value} onChange={setValue}>
      <Select.Label>상품 선택 (상태 표시)</Select.Label>
      <Select.Trigger>선택하세요</Select.Trigger>
      <Select.List>
        <Select.Option value="apple">
          사과 <span className="text-red-500 font-semibold">인기</span>
        </Select.Option>
        <Select.Option value="banana">
          바나나 <span className="text-primary-500 font-semibold">신상품</span>
        </Select.Option>
        <Select.Option value="orange">
          오렌지 <span className="text-green-500 font-semibold">추천</span>
        </Select.Option>
        <Select.Option value="grape">
          포도 <span className="text-purple-500 font-semibold">특가</span>
        </Select.Option>
        <Select.Option value="mango">
          망고 <span className="text-orange-500 font-semibold">베스트</span>
        </Select.Option>
      </Select.List>
    </Select>
  );
}

export const ColoredTextOption: Story = {
  render: () => <ColoredTextOptionExample />,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: false,
        iframeHeight: 350,
      },
    },
  },
};

function RichContentOptionExample() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select width="20rem" value={value} onChange={setValue}>
      <Select.Label>상품 선택 (상세 정보 포함)</Select.Label>
      <Select.Trigger>선택하세요</Select.Trigger>
      <Select.List maxHeight="25rem">
        <Select.Option value="premium-apple">
          <div className="flex items-center justify-between w-full">
            <span>프리미엄 사과</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-red-500 font-semibold text-sm">인기</span>
              <span className="text-gray-500 text-xs">₩15,000</span>
            </div>
          </div>
        </Select.Option>
        <Select.Option value="organic-banana">
          <div className="flex items-center justify-between w-full">
            <span>유기농 바나나</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                할인
              </span>
              <span className="text-gray-400 text-xs line-through">₩8,000</span>
              <span className="text-gray-500 text-xs">₩6,000</span>
            </div>
          </div>
        </Select.Option>
        <Select.Option value="fresh-orange">
          <div className="flex items-center justify-between w-full">
            <span>신선한 오렌지</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-primary-500 font-semibold text-sm">
                신상품
              </span>
              <span className="text-gray-500 text-xs">₩12,000</span>
            </div>
          </div>
        </Select.Option>
        <Select.Option value="premium-grape">
          <div className="flex items-center justify-between w-full">
            <span>프리미엄 포도</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-purple-500 font-semibold text-sm">
                특가
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-medium">
                재고부족
              </span>
              <span className="text-gray-500 text-xs">₩20,000</span>
            </div>
          </div>
        </Select.Option>
        <Select.Option value="tropical-mango">
          <div className="flex items-center justify-between w-full">
            <span>열대 망고</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-orange-500 font-semibold text-sm">
                베스트
              </span>
              <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-medium">
                무료배송
              </span>
              <span className="text-gray-500 text-xs">₩18,000</span>
            </div>
          </div>
        </Select.Option>
        <Select.Option value="seasonal-strawberry">
          <div className="flex items-center justify-between w-full">
            <span>제철 딸기</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-pink-500 font-semibold text-sm">NEW</span>
              <span className="text-gray-500 text-xs">₩10,000</span>
            </div>
          </div>
        </Select.Option>
      </Select.List>
    </Select>
  );
}

export const RichContentOption: Story = {
  render: () => <RichContentOptionExample />,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
};
