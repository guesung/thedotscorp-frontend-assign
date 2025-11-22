import type { PropsWithChildren } from "react";
import { useSelectContext } from "./SelectRoot";

interface SelectPopupProps extends PropsWithChildren {}

export function SelectPopup({ children }: SelectPopupProps) {
  const { isOpen, listboxId, labelId } = useSelectContext();

  if (!isOpen) return null;

  return (
    <ul
      id={listboxId}
      role="listbox"
      aria-labelledby={labelId}
      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      {children}
    </ul>
  );
}
