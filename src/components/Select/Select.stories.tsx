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
  render: () => {
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
