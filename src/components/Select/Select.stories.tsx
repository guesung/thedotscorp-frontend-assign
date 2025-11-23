import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Default() {
    const [value, setValue] = useState<string>();

    return (
      <Select value={value} onChange={setValue} variant="default">
        <Select.Label>과일 선택</Select.Label>
        <Select.Trigger>{value || "선택하세요"}</Select.Trigger>
        <Select.Popup>
          <Select.Option value="apple">사과</Select.Option>
          <Select.Option value="banana">바나나</Select.Option>
          <Select.Option value="orange">오렌지</Select.Option>
        </Select.Popup>
      </Select>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Select variant="disabled">
        <Select.Label>과일 선택</Select.Label>
        <Select.Trigger>선택하세요</Select.Trigger>
        <Select.Popup>
          <Select.Option value="apple">사과</Select.Option>
          <Select.Option value="banana">바나나</Select.Option>
          <Select.Option value="orange">오렌지</Select.Option>
        </Select.Popup>
      </Select>
    );
  },
};

function DisabledOptionExample() {
  const [value, setValue] = useState<string>();

  return (
    <Select value={value} onChange={setValue}>
      <Select.Label>과일 선택 (일부 품절)</Select.Label>
      <Select.Trigger>{value || "선택하세요"}</Select.Trigger>
      <Select.Popup>
        <Select.Option value="apple">사과</Select.Option>
        <Select.Option value="banana" disabled>
          바나나 (품절)
        </Select.Option>
        <Select.Option value="orange">오렌지</Select.Option>
        <Select.Option value="grape" disabled>
          포도 (품절)
        </Select.Option>
        <Select.Option value="mango">망고</Select.Option>
      </Select.Popup>
    </Select>
  );
}

export const DisabledOption: Story = {
  render: () => <DisabledOptionExample />,
};

function GroupedOptionsExample() {
  const [value, setValue] = useState<string>();

  return (
    <Select value={value} onChange={setValue}>
      <Select.Label>음식 선택</Select.Label>
      <Select.Trigger>{value || "선택하세요"}</Select.Trigger>
      <Select.Popup>
        <Select.Group label="과일">
          <Select.Option value="apple">사과</Select.Option>
          <Select.Option value="banana">바나나</Select.Option>
          <Select.Option value="orange">오렌지</Select.Option>
        </Select.Group>
        <Select.Group label="채소">
          <Select.Option value="carrot">당근</Select.Option>
          <Select.Option value="broccoli" disabled>
            브로콜리 (품절)
          </Select.Option>
          <Select.Option value="spinach">시금치</Select.Option>
        </Select.Group>
        <Select.Group label="육류">
          <Select.Option value="beef">소고기</Select.Option>
          <Select.Option value="pork">돼지고기</Select.Option>
          <Select.Option value="chicken">닭고기</Select.Option>
        </Select.Group>
      </Select.Popup>
    </Select>
  );
}

export const GroupedOptions: Story = {
  render: () => <GroupedOptionsExample />,
};
