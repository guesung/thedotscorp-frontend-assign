import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import Select from './Select';

describe('Select with react-hook-form', () => {
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

    // Trigger 클릭하여 드롭다운 열기
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // 옵션 선택
    const appleOption = screen.getByRole('option', { name: '사과' });
    await user.click(appleOption);

    // 값이 변경되었는지 확인
    await waitFor(() => {
      expect(trigger).toHaveTextContent('사과');
    });

    // 폼 제출
    const submitButton = screen.getByRole('button', { name: '제출' });
    await user.click(submitButton);

    // 제출된 값 확인
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

    // 값 없이 제출
    const submitButton = screen.getByRole('button', { name: '제출' });
    await user.click(submitButton);

    // 에러 메시지 확인
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

    // 초기값 확인
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('사과');

    // 리셋 버튼 클릭
    const resetButton = screen.getByRole('button', { name: '리셋' });
    await user.click(resetButton);

    // 값이 리셋되었는지 확인
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

      // 값이 변경될 때마다 콜백 호출
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

    // 옵션 선택
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    const bananaOption = screen.getByRole('option', { name: '바나나' });
    await user.click(bananaOption);

    // watch 콜백이 호출되었는지 확인
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('banana');
    });
  });
});
