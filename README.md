# **커넥팅더닷츠 과제**

## Select

### 컴포넌트 구조 설계

### 1. 합성 컴포넌트 패턴

합성 컴포넌트(Compound Component)는 루트 컴포넌트에서 상태를 관리하고, Context API를 통해 자식 컴포넌트에서 이 상태에 접근할 수 있도록 하는 패턴입니다. 이 패턴을 선택한 이유는 다음과 같습니다.

1. **유연한 조합**: 필요한 서브 컴포넌트만 선택적으로 사용할 수 있습니다.
2. **확장성**: 새로운 서브 컴포넌트를 추가하기 쉽습니다.
3. **관심사 분리**: 각 서브 컴포넌트가 자신의 역할에만 집중합니다.
4. **선언적 API**: 사용하는 측에서 구조를 명확하게 파악할 수 있습니다.

```tsx
// 사용 예시
<Select defaultSelectedValue="react">
  <Select.Label>프레임워크 선택</Select.Label>
  <Select.Trigger>선택하세요</Select.Trigger>
  <Select.List>
    <Select.Option value="react">React</Select.Option>
    <Select.Option value="vue">Vue</Select.Option>
  </Select.List>
</Select>
```

### 2. 컴포넌트 구성

| 컴포넌트         | 역할                                        |
| ---------------- | ------------------------------------------- |
| `Select` (Root)  | 상태 관리 및 Context Provider               |
| `Select.Label`   | 접근성을 위한 라벨 (`aria-labelledby` 연결) |
| `Select.Trigger` | 드롭다운 토글 버튼, 키보드 이벤트 처리      |
| `Select.List`    | 옵션 목록 컨테이너 (`role="listbox"`)       |
| `Select.Option`  | 개별 옵션 아이템 (`role="option"`)          |
| `Select.Group`   | 옵션 그룹핑 (`role="group"`)                |

### 3. 상태 관리

루트 컴포넌트에서 관리하는 상태값

| 상태               | 타입                  | 설명                              |
| ------------------ | --------------------- | --------------------------------- |
| `isOpen`           | `boolean`             | 드롭다운 열림 여부                |
| `selectedValue`    | `string \| undefined` | 현재 선택된 옵션의 value          |
| `highlightedIndex` | `number`              | 키보드로 하이라이트된 옵션 인덱스 |
| `options`          | `SelectOption[]`      | 등록된 옵션 목록                  |

추가로 접근성을 위한 ID 값들(`listboxId`, `labelId`)과 트리거 버튼의 ref(`triggerRef`)를 Context로 공유합니다.

### 고민한 부분

### 1. 옵션 등록 방식

합성 컴포넌트 패턴에서 키보드 네비게이션을 구현하려면 전체 옵션 목록을 알아야 합니다. 하지만 자식 컴포넌트가 동적으로 렌더링되기 때문에 부모가 자식의 정보를 직접 알 수 없습니다.

이를 해결하기 위해 자기 등록 패턴을 적용했습니다.

```tsx
// SelectRoot.tsx - 옵션 등록 함수 제공
const registerOption = useCallback(
  ({ value, children, disabled = false }: RegisterOptionProps) => {
    setOptions((prev) => {
      const exists = prev.some((option) => option.value === value);
      return exists ? prev : [...prev, { value, children, disabled }];
    });
  },
  []
);

// SelectOption.tsx - 마운트 시 자신을 등록
useEffect(() => {
  if (options.find((option) => option.value === value)) return;
  registerOption({ value, children, disabled });
}, [value, children, disabled, registerOption, options]);
```

### 2. 키보드 접근성

WAI-ARIA Combobox 패턴을 따라 키보드 인터랙션을 구현했습니다.

| 키          | 동작                                               |
| ----------- | -------------------------------------------------- |
| `ArrowDown` | 다음 옵션으로 이동 (닫힌 상태에서는 드롭다운 열기) |
| `ArrowUp`   | 이전 옵션으로 이동                                 |
| `Enter`     | 하이라이트된 옵션 선택 또는 드롭다운 열기          |
| `Escape`    | 드롭다운 닫기 및 트리거로 포커스 복귀              |

disabled된 옵션은 키보드 네비게이션에서 건너뛰도록 구현했습니다.

```tsx
// SelectTrigger.tsx
const findNextEnabledIndex = (
  currentIndex: number,
  direction: "up" | "down"
) => {
  const optionCount = options.length;
  let nextIndex = currentIndex;

  for (let i = 0; i < optionCount; i++) {
    nextIndex =
      (nextIndex + (direction === "down" ? 1 : -1) + optionCount) % optionCount;
    if (options[nextIndex] && !options[nextIndex].disabled) {
      return nextIndex;
    }
  }
  return currentIndex;
};
```

### 3. 하이라이트된 옵션 스크롤

옵션 목록이 길어 스크롤이 필요한 경우, 키보드 이동 시 하이라이트된 옵션이 항상 보이도록 `scrollIntoView`를 적용했습니다.

```tsx
// SelectList.tsx
useEffect(() => {
  if (!isOpen || highlightedIndex === undefined) return;

  const optionId = `${listboxId}-option-${highlightedIndex}`;
  const optionElement = document.getElementById(optionId);

  optionElement?.scrollIntoView({
    block: highlightedIndex === 0 ? "end" : "nearest",
  });
}, [highlightedIndex, isOpen, listboxId]);
```

### 4. ARIA 속성

스크린 리더 사용자를 위해 WAI-ARIA 명세에 따른 속성을 적용했습니다.

**Trigger (combobox)**

- `role="combobox"`: 콤보박스 역할 명시
- `aria-haspopup="listbox"`: 팝업 유형 명시
- `aria-expanded`: 드롭다운 열림 상태
- `aria-controls`: 연결된 listbox ID
- `aria-labelledby`: 연결된 label ID
- `aria-activedescendant`: 현재 하이라이트된 옵션 ID

**List (listbox)**

- `role="listbox"`: 옵션 목록 역할
- `aria-labelledby`: 연결된 label ID

**Option**

- `role="option"`: 옵션 역할
- `aria-selected`: 선택 상태
- `aria-disabled`: 비활성화 상태

### 5. 선택된 옵션 표시

트리거 버튼에 선택된 옵션의 내용을 표시하기 위해 `selectedOption` 상태를 별도로 관리합니다. 이는 단순 텍스트뿐만 아니라 아이콘 등이 포함된 복잡한 ReactNode도 지원하기 위함입니다.

```tsx
// SelectRoot.tsx
const selectedOption = useMemo(() => {
  return options.find((option) => option.value === selectedValue)?.children;
}, [selectedValue, options]);
```

---

## Modal

### 컴포넌트 구조 설계

### 1. 합성 컴포넌트 패턴

Modal도 Select와 동일하게 합성 컴포넌트 패턴을 사용합니다. 다만 Select와 달리 **제어 컴포넌트(Controlled Component)** 방식으로 설계해 `isOpen`과 `onClose`를 외부에서 주입받습니다. 이렇게 설계한 이유는 모달의 열림/닫힘은 버튼 클릭 외에도 라우팅, API 요청 등에 의해 제어되는 경우가 빈번하기 때문입니다.

```tsx
// 사용 예시
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Content>
    <Modal.Header>
      <Modal.CloseButton />
      제목
    </Modal.Header>
    <Modal.Body>내용</Modal.Body>
    <Modal.Footer>
      <button onClick={() => setIsOpen(false)}>닫기</button>
    </Modal.Footer>
  </Modal.Content>
</Modal>;
```

### 2. 컴포넌트 구성

| 컴포넌트            | 역할                                          |
| ------------------- | --------------------------------------------- |
| `Modal` (Root)      | 상태 관리, Context Provider, 애니메이션 제어  |
| `Modal.Portal`      | `createPortal`을 사용해document.body에 렌더링 |
| `Modal.Overlay`     | 배경 오버레이, 클릭 시 닫기 지원              |
| `Modal.Content`     | 실제 모달 콘텐츠 영역, 포커스 트랩 적용       |
| `Modal.Header`      | 모달 헤더 영역                                |
| `Modal.Body`        | 모달 본문 영역                                |
| `Modal.Footer`      | 모달 푸터 영역 (버튼 등)                      |
| `Modal.CloseButton` | 닫기 버튼                                     |

### 3. 상태 관리

| 상태            | 타입         | 설명                       |
| --------------- | ------------ | -------------------------- |
| `isOpen`        | `boolean`    | 모달 열림 여부 (외부 제어) |
| `onClose`       | `() => void` | 모달 닫기 콜백             |
| `shouldRender`  | `boolean`    | 모달 열림 여부 (내부 제어) |
| `isAnimating`   | `boolean`    | 애니메이션 진행 중 여부    |
| `titleId`       | `string`     | 제목 요소 ID (접근성)      |
| `descriptionId` | `string`     | 설명 요소 ID (접근성)      |

외부에서 제어하는 `isOpen`과 내부에서 제어하는 `shouldRender`를 분리한 이유는, 모달이 제거될 때 애니메이션이 종료된 후 내부에서 제어하는 shouldRender를 false로 변경해 모달을 언마운트하기 위함입니다.

### 고민한 부분

### 1. 애니메이션 처리

Modal을 열고 닫을 때 fade 애니메이션을 적용해야 합니다. 하지만 `isOpen`이 `false`가 되면 즉시 컴포넌트가 언마운트되어 닫히는 애니메이션이 보이지 않는 문제가 있습니다.

이를 해결하기 위해 두 개의 상태를 분리했습니다.

- `shouldRender`: 실제로 DOM에 렌더링할지 여부
- `isAnimating`: CSS transition을 트리거하는 상태

```tsx
// ModalRoot.tsx
useEffect(() => {
  if (isOpen) {
    // 열기: 먼저 렌더링 → 다음 프레임에 애니메이션 시작
    setShouldRender(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
  } else {
    // 닫기: 먼저 애니메이션 종료 → duration 후 언마운트
    setIsAnimating(false);
    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 200); // transition duration과 동일
    return () => clearTimeout(timer);
  }
}, [isOpen]);
```

`requestAnimationFrame`을 두 번 호출한 이유는 브라우저가 `shouldRender`로 인한 DOM 삽입을 먼저 처리(paint)한 후, `isAnimating` 상태 변경에 의한 CSS transition이 제대로 적용되도록 하기 위함입니다.

### 2. 포커스 트랩 (Focus Trap)

Modal이 열렸을 때 키보드 포커스가 Modal 내부에서만 순환하도록 `useFocusTrap` 훅을 구현했습니다.

```tsx
// useFocusTrap.ts
export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements(containerRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift+Tab으로 첫 요소에서 벗어나려 하면 마지막으로
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab으로 마지막 요소에서 벗어나려 하면 처음으로
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [containerRef]);
}
```

### 3. 배경 스크롤 방지

Modal이 열렸을 때 배경 콘텐츠가 스크롤되지 않도록 `useBodyScrollLock` 훅을 구현했습니다. 클린업 함수에서 원래 스타일을 복원합니다.

```tsx
// useBodyScrollLock.ts
export function useBodyScrollLock() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
}
```

### 4. Escape 키로 닫기

`useKeyboardEvent` 훅을 사용하여 Escape 키 입력 시 Modal을 닫도록 구현했습니다. 이 훅은 특정 키 입력에 대한 전역 이벤트 핸들러를 등록합니다.

### 5. ARIA 속성

스크린 리더 사용자를 위해 WAI-ARIA Dialog 패턴에 따른 속성을 적용했습니다:

**Content (dialog)**

- `role="dialog"`: 다이얼로그 역할 명시
- `aria-modal="true"`: 모달 다이얼로그임을 명시
- `aria-labelledby`: 제목 요소 ID 연결
- `aria-describedby`: 설명 요소 ID 연결

**Overlay**

- `aria-hidden="true"`: 스크린 리더가 배경을 무시하도록

### 6. Portal 렌더링

Modal이 DOM 트리 어디에 위치하든 상관없이 항상 `document.body`에 렌더링되도록 React Portal을 사용했습니다. 이를 통해 z-index 스택 컨텍스트 문제를 방지하고, 부모 요소의 `overflow: hidden` 영향 받지 않고, CSS 상속 문제 최소화의 효과가 있습니다.
