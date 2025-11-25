import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SelectOption, type SelectOptionProps } from './SelectOption';
import { cn } from '@/utils/cn';

type SelectVariant = 'default' | 'disabled';

interface SelectOptionData {
  value: string;
  children: ReactNode;
  disabled: boolean;
}

interface SelectContextValue {
  isOpen: boolean; // DropDown 열림 여부
  setIsOpen: (open: boolean) => void;
  selectedValue?: string; // 선택된 값
  setSelectedValue: (value: string | undefined) => void;
  highlightedIndex: number; // 하이라이트된 옵션 인덱스
  setHighlightedIndex: (index: number) => void;
  options: SelectOptionData[]; // 옵션 목록
  selectedOption?: ReactNode; // 선택된 옵션의 children
  triggerRef: RefObject<HTMLButtonElement | null>;
  listboxId: string; // 리스트 박스(Popup) ID
  labelId: string; // 라벨 ID
  variant: SelectVariant; // 변경 가능한 버전 (default, disabled)
}

const SelectContext = createContext<SelectContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select 컴포넌트 내부에서 사용해야 합니다.');
  }
  return context;
}

export interface SelectHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  focus: () => void;
  blur: () => void;
  selectValue: (value: string) => void;
}

export interface SelectRootProps extends PropsWithChildren {
  variant?: SelectVariant;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export const SelectRoot = forwardRef<SelectHandle, SelectRootProps>(function SelectRoot(
  { children, variant = 'default', value, onChange, className },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const options = useMemo(() => {
    const collectOptions = (children: ReactNode, collected: SelectOptionData[] = []): SelectOptionData[] => {
      Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        const props = child.props as PropsWithChildren;

        if (child.type === SelectOption) {
          const optionProps = props as SelectOptionProps;
          collected.push({
            value: optionProps.value,
            children: optionProps.children,
            disabled: optionProps.disabled ?? false,
          });
          return;
        }

        if (props.children) {
          collectOptions(props.children, collected);
        }
      });
      return collected;
    };

    return collectOptions(children);
  }, [children]);

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value)?.children;
  }, [value, options]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(containerRef, handleClose);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        if (variant !== 'disabled') {
          setIsOpen(true);
          const selectedIndex = options.findIndex(option => option.value === value);
          if (selectedIndex !== -1) {
            setHighlightedIndex(selectedIndex);
          }
        }
      },
      close: () => {
        setIsOpen(false);
        triggerRef.current?.focus();
      },
      toggle: () => {
        if (variant !== 'disabled') {
          if (isOpen) {
            setIsOpen(false);
            triggerRef.current?.focus();
          } else {
            setIsOpen(true);
            const selectedIndex = options.findIndex(option => option.value === value);
            if (selectedIndex !== -1) {
              setHighlightedIndex(selectedIndex);
            }
          }
        }
      },
      focus: () => {
        triggerRef.current?.focus();
      },
      blur: () => {
        triggerRef.current?.blur();
      },
      selectValue: (newValue: string) => {
        if (variant !== 'disabled') {
          const option = options.find(opt => opt.value === newValue);
          if (option && !option.disabled) {
            onChange(newValue);
            setIsOpen(false);
            triggerRef.current?.focus();
          }
        }
      },
    }),
    [variant, isOpen, options, value, onChange],
  );

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selectedValue: value,
      setSelectedValue: onChange,
      highlightedIndex,
      setHighlightedIndex,
      options,
      selectedOption,
      triggerRef,
      listboxId,
      labelId,
      variant,
    }),
    [isOpen, value, onChange, highlightedIndex, options, selectedOption, listboxId, labelId, variant],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn('relative w-64', className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
});
