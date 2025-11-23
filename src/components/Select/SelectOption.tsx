import { useEffect, type PropsWithChildren, type ReactNode } from "react";
import { useSelectContext } from "./SelectRoot";

interface SelectOptionProps extends PropsWithChildren {
  value: string;
  disabled?: boolean;
}

// ReactNode를 문자열로 변환하는 헬퍼 함수
function nodeToString(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    return node.map(nodeToString).join("");
  }
  if (node && typeof node === "object") {
    // React element인 경우
    if ("props" in node && node.props) {
      const props = node.props as { children?: ReactNode };
      if (props.children) {
        return nodeToString(props.children);
      }
    }
  }
  return "";
}

export function SelectOption({
  children,
  value,
  disabled = false,
}: SelectOptionProps) {
  const {
    setSelectedValue,
    setIsOpen,
    highlightedIndex,
    options,
    registerOption,
    triggerRef,
    listboxId,
    selectedValue,
  } = useSelectContext();

  const index = options.findIndex((option) => option.value === value);
  const isHighlighted = index === highlightedIndex;
  const isSelected = value === selectedValue;

  useEffect(() => {
    const label = nodeToString(children);
    registerOption({ value, label, disabled });
  }, [value, children, disabled, registerOption]);

  const handleClick = () => {
    if (disabled) return;
    setSelectedValue(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <li
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleClick}
      className={`px-3 py-2 ${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : isHighlighted
          ? "bg-blue-500 text-white cursor-pointer"
          : "hover:bg-gray-100 cursor-pointer"
      }`}
    >
      {children}
    </li>
  );
}
