import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Select from './Select';

describe('Select', () => {
  describe('label + trigger + popup(list) 구성', () => {
    it('label, trigger, list가 올바르게 렌더링되어야 함', () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const label = screen.getByText('과일 선택');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('선택하세요');

      const listbox = screen.queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
    });

    it('trigger 클릭 시 list가 열려야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: '사과' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '바나나' })).toBeInTheDocument();
    });
  });

  describe('option 선택 → trigger에 반영', () => {
    it('옵션 선택 시 trigger에 선택된 값이 표시되어야 함', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        const handleChange = (newValue: string | undefined) => {
          setValue(newValue);
          onChange(newValue);
        };

        return (
          <Select value={value} onChange={handleChange}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
              <Select.Option value="orange">오렌지</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const appleOption = screen.getByRole('option', { name: '사과' });
      await user.click(appleOption);

      await waitFor(() => {
        expect(trigger).toHaveTextContent('사과');
        expect(onChange).toHaveBeenCalledWith('apple');
      });

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('다른 옵션 선택 시 trigger가 업데이트되어야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>('apple');

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('사과');

      await user.click(trigger);
      const bananaOption = screen.getByRole('option', { name: '바나나' });
      await user.click(bananaOption);

      await waitFor(() => {
        expect(trigger).toHaveTextContent('바나나');
      });
    });
  });

  describe('키보드 네비게이션', () => {
    it('ArrowDown 키로 드롭다운을 열고 다음 옵션으로 이동해야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
              <Select.Option value="orange">오렌지</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const appleOption = screen.getByRole('option', { name: '사과' });
      expect(appleOption).toHaveAttribute('aria-selected', 'false');

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const bananaOption = screen.getByRole('option', { name: '바나나' });
        expect(bananaOption).toHaveClass('bg-primary-500');
      });
    });

    it('ArrowUp 키로 이전 옵션으로 이동해야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
              <Select.Option value="orange">오렌지</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');

      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        const appleOption = screen.getByRole('option', { name: '사과' });
        expect(appleOption).toHaveClass('bg-primary-500');
      });
    });

    it('Enter 키로 옵션을 선택해야 함', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        const handleChange = (newValue: string | undefined) => {
          setValue(newValue);
          onChange(newValue);
        };

        return (
          <Select value={value} onChange={handleChange}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(trigger).toHaveTextContent('사과');
        expect(onChange).toHaveBeenCalledWith('apple');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('Escape 키로 드롭다운을 닫아야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });

      expect(trigger).toHaveFocus();
    });
  });

  describe('포커스 관리', () => {
    it('옵션 선택 후 focus가 trigger로 돌아가야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const appleOption = screen.getByRole('option', { name: '사과' });
      await user.click(appleOption);

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it('Escape 키로 닫을 때 focus가 trigger로 돌아가야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('aria 속성 준수', () => {
    it('trigger에 올바른 aria 속성이 있어야 함', () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('role', 'combobox');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
      expect(trigger).toHaveAttribute('aria-labelledby');
    });

    it('드롭다운이 열렸을 때 aria-expanded가 true여야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('listbox에 올바른 aria 속성이 있어야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toHaveAttribute('role', 'listbox');
        expect(listbox).toHaveAttribute('aria-labelledby');
        expect(listbox).toHaveAttribute('id');
      });
    });

    it('option에 올바른 aria 속성이 있어야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>('apple');

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana">바나나</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const appleOption = screen.getByRole('option', { name: '사과' });
        expect(appleOption).toHaveAttribute('role', 'option');
        expect(appleOption).toHaveAttribute('aria-selected', 'true');

        const bananaOption = screen.getByRole('option', { name: '바나나' });
        expect(bananaOption).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('label과 trigger가 올바르게 연결되어야 함', () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const label = screen.getByText('과일 선택');
      const trigger = screen.getByRole('combobox');

      const labelId = label.getAttribute('id');
      const triggerLabelledBy = trigger.getAttribute('aria-labelledby');

      expect(labelId).toBe(triggerLabelledBy);
    });
  });

  describe('기본 variant', () => {
    it('default variant일 때 정상적으로 동작해야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue} variant="default">
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).not.toBeDisabled();
      expect(trigger).toHaveAttribute('aria-disabled', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });

  describe('비활성화 variant', () => {
    it('disabled variant일 때 trigger가 비활성화되어야 함', () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue} variant="disabled">
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveClass('cursor-not-allowed');
    });

    it('disabled variant일 때 클릭해도 드롭다운이 열리지 않아야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue} variant="disabled">
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('disabled variant일 때 키보드로도 동작하지 않아야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue} variant="disabled">
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('disabled variant일 때 label 스타일이 변경되어야 함', () => {
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue} variant="disabled">
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const label = screen.getByText('과일 선택');
      expect(label).toHaveClass('text-gray-400');
    });
  });

  describe('비활성화된 옵션', () => {
    it('disabled option은 클릭해도 선택되지 않아야 함', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        const handleChange = (newValue: string | undefined) => {
          setValue(newValue);
          onChange(newValue);
        };

        return (
          <Select value={value} onChange={handleChange}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana" disabled>
                바나나
              </Select.Option>
              <Select.Option value="orange">오렌지</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const disabledOption = screen.getByRole('option', { name: '바나나' });
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
      expect(disabledOption).toHaveClass('cursor-not-allowed');

      await user.click(disabledOption);

      expect(onChange).not.toHaveBeenCalled();
      expect(trigger).toHaveTextContent('선택하세요');
    });

    it('disabled option은 키보드 네비게이션에서 건너뛰어야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana" disabled>
                바나나
              </Select.Option>
              <Select.Option value="orange">오렌지</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const appleOption = screen.getByRole('option', { name: '사과' });
      expect(appleOption).toHaveClass('bg-primary-500');

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const orangeOption = screen.getByRole('option', { name: '오렌지' });
        expect(orangeOption).toHaveClass('bg-primary-500');
      });
    });

    it('키보드 네비게이션에서 disabled option은 건너뛰고 Enter로 선택할 수 있어야 함', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        const handleChange = (newValue: string | undefined) => {
          setValue(newValue);
          onChange(newValue);
        };

        return (
          <Select value={value} onChange={handleChange}>
            <Select.Label>과일 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Option value="apple">사과</Select.Option>
              <Select.Option value="banana" disabled>
                바나나
              </Select.Option>
              <Select.Option value="orange">오렌지</Select.Option>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const appleOption = screen.getByRole('option', { name: '사과' });
      expect(appleOption).toHaveClass('bg-primary-500');

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const orangeOption = screen.getByRole('option', { name: '오렌지' });
        expect(orangeOption).toHaveClass('bg-primary-500');
      });

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('orange');
        expect(trigger).toHaveTextContent('오렌지');
      });
    });
  });

  describe('그룹화된 옵션', () => {
    it('SelectGroup을 사용하여 옵션을 그룹화할 수 있어야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>음식 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Group label="과일">
                <Select.Option value="apple">사과</Select.Option>
                <Select.Option value="banana">바나나</Select.Option>
              </Select.Group>
              <Select.Group label="채소">
                <Select.Option value="carrot">당근</Select.Option>
                <Select.Option value="tomato">토마토</Select.Option>
              </Select.Group>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });

      expect(screen.getByText('과일')).toBeInTheDocument();
      expect(screen.getByText('채소')).toBeInTheDocument();

      expect(screen.getByRole('option', { name: '사과' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '바나나' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '당근' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '토마토' })).toBeInTheDocument();
    });

    it('그룹화된 옵션을 선택할 수 있어야 함', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        const handleChange = (newValue: string | undefined) => {
          setValue(newValue);
          onChange(newValue);
        };

        return (
          <Select value={value} onChange={handleChange}>
            <Select.Label>음식 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Group label="과일">
                <Select.Option value="apple">사과</Select.Option>
                <Select.Option value="banana">바나나</Select.Option>
              </Select.Group>
              <Select.Group label="채소">
                <Select.Option value="carrot">당근</Select.Option>
              </Select.Group>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const carrotOption = screen.getByRole('option', { name: '당근' });
      await user.click(carrotOption);

      await waitFor(() => {
        expect(trigger).toHaveTextContent('당근');
        expect(onChange).toHaveBeenCalledWith('carrot');
      });
    });

    it('그룹화된 옵션에서 키보드 네비게이션이 동작해야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>음식 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Group label="과일">
                <Select.Option value="apple">사과</Select.Option>
                <Select.Option value="banana">바나나</Select.Option>
              </Select.Group>
              <Select.Group label="채소">
                <Select.Option value="carrot">당근</Select.Option>
              </Select.Group>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const appleOption = screen.getByRole('option', { name: '사과' });
      expect(appleOption).toHaveClass('bg-primary-500');

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const bananaOption = screen.getByRole('option', { name: '바나나' });
        expect(bananaOption).toHaveClass('bg-primary-500');
      });

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const carrotOption = screen.getByRole('option', { name: '당근' });
        expect(carrotOption).toHaveClass('bg-primary-500');
      });
    });

    it('그룹에 aria 속성이 올바르게 설정되어야 함', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = useState<string | undefined>(undefined);

        return (
          <Select value={value} onChange={setValue}>
            <Select.Label>음식 선택</Select.Label>
            <Select.Trigger>선택하세요</Select.Trigger>
            <Select.List>
              <Select.Group label="과일">
                <Select.Option value="apple">사과</Select.Option>
              </Select.Group>
            </Select.List>
          </Select>
        );
      };

      render(<TestComponent />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toHaveAttribute('role', 'group');
        expect(group).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('react-hook-form 연동', () => {
    it('Controller를 통해 값이 올바르게 제어되어야 함', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      function TestForm() {
        const { control, handleSubmit } = useForm<{ fruit: string }>({
          defaultValues: { fruit: '' },
        });

        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fruit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange}>
                  <Select.Label>과일 선택</Select.Label>
                  <Select.Trigger>선택하세요</Select.Trigger>
                  <Select.List>
                    <Select.Option value="apple">사과</Select.Option>
                    <Select.Option value="banana">바나나</Select.Option>
                    <Select.Option value="orange">오렌지</Select.Option>
                  </Select.List>
                </Select>
              )}
            />
            <button type="submit">제출</button>
          </form>
        );
      }

      render(<TestForm />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const appleOption = screen.getByRole('option', { name: '사과' });
      await user.click(appleOption);

      await waitFor(() => {
        expect(trigger).toHaveTextContent('사과');
      });

      const submitButton = screen.getByRole('button', { name: '제출' });
      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith({ fruit: 'apple' }, expect.any(Object));
    });

    it('validation이 올바르게 동작해야 함', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const onError = vi.fn();

      function TestForm() {
        const {
          control,
          handleSubmit,
          formState: { errors },
        } = useForm<{ fruit: string }>({
          defaultValues: { fruit: '' },
        });

        return (
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Controller
              name="fruit"
              control={control}
              rules={{ required: '과일을 선택해주세요' }}
              render={({ field }) => (
                <div>
                  <Select value={field.value} onChange={field.onChange}>
                    <Select.Label>과일 선택</Select.Label>
                    <Select.Trigger>선택하세요</Select.Trigger>
                    <Select.List>
                      <Select.Option value="apple">사과</Select.Option>
                      <Select.Option value="banana">바나나</Select.Option>
                    </Select.List>
                  </Select>
                  {errors.fruit && <span>{errors.fruit.message}</span>}
                </div>
              )}
            />
            <button type="submit">제출</button>
          </form>
        );
      }

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: '제출' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('과일을 선택해주세요')).toBeInTheDocument();
        expect(onError).toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it('reset이 올바르게 동작해야 함', async () => {
      const user = userEvent.setup();

      function TestForm() {
        const { control, reset } = useForm<{ fruit: string }>({
          defaultValues: { fruit: 'apple' },
        });

        return (
          <div>
            <Controller
              name="fruit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange}>
                  <Select.Label>과일 선택</Select.Label>
                  <Select.Trigger>선택하세요</Select.Trigger>
                  <Select.List>
                    <Select.Option value="apple">사과</Select.Option>
                    <Select.Option value="banana">바나나</Select.Option>
                  </Select.List>
                </Select>
              )}
            />
            <button type="button" onClick={() => reset({ fruit: '' })}>
              리셋
            </button>
          </div>
        );
      }

      render(<TestForm />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('사과');

      const resetButton = screen.getByRole('button', { name: '리셋' });
      await user.click(resetButton);

      await waitFor(() => {
        expect(trigger).toHaveTextContent('선택하세요');
      });
    });

    it('watch를 통해 값 변경을 감지할 수 있어야 함', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      function TestForm() {
        const { control, watch } = useForm<{ fruit: string }>({
          defaultValues: { fruit: '' },
        });

        const fruitValue = watch('fruit');

        useEffect(() => {
          if (fruitValue) {
            onValueChange(fruitValue);
          }
        }, [fruitValue]);

        return (
          <Controller
            name="fruit"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onChange={field.onChange}>
                <Select.Label>과일 선택</Select.Label>
                <Select.Trigger>선택하세요</Select.Trigger>
                <Select.List>
                  <Select.Option value="apple">사과</Select.Option>
                  <Select.Option value="banana">바나나</Select.Option>
                </Select.List>
              </Select>
            )}
          />
        );
      }

      render(<TestForm />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      const bananaOption = screen.getByRole('option', { name: '바나나' });
      await user.click(bananaOption);

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith('banana');
      });
    });
  });
});
