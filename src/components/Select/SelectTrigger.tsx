import { useEffect, type KeyboardEvent, type ReactNode } from "react";
import { useSelectContext } from "./SelectRoot";

interface SelectTriggerProps {
  children: ReactNode;
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    options,
    setSelectedValue,
    triggerRef,
    listboxId,
    labelId,
    variant,
    selectedValue,
    selectedLabel,
  } = useSelectContext();

  const findNextEnabledIndex = (currentIndex: number, direction: 1 | -1) => {
    const len = options.length;
    let nextIndex = currentIndex;

    for (let i = 0; i < len; i++) {
      nextIndex = (nextIndex + direction + len) % len;
      if (options[nextIndex] && !options[nextIndex].disabled) {
        return nextIndex;
      }
    }
    return currentIndex;
  };

  const isDisabled = variant === "disabled";

  const handleOpen = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && selectedValue && options.length > 0) {
      const selectedIndex = options.findIndex(
        (option) => option.value === selectedValue
      );
      if (selectedIndex !== -1) {
        setHighlightedIndex(selectedIndex);
      }
    }
  }, [isOpen, selectedValue, options, setHighlightedIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          setHighlightedIndex(findNextEnabledIndex(highlightedIndex, 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(findNextEnabledIndex(highlightedIndex, -1));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          isOpen &&
          options[highlightedIndex] &&
          !options[highlightedIndex].disabled
        ) {
          setSelectedValue(options[highlightedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        } else if (!isOpen) {
          handleOpen();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const activeOptionId =
    isOpen && options[highlightedIndex] && !options[highlightedIndex].disabled
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  const handleClick = () => {
    if (isDisabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      handleOpen();
    }
  };

  const displayText = selectedLabel || children || "선택하세요";

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-labelledby={labelId}
      aria-activedescendant={activeOptionId}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`w-full px-3 py-2 text-left rounded-md shadow-sm focus:outline-none ${
        isDisabled
          ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }`}
    >
      {displayText}
    </button>
  );
}
