# Select

<img width="294" height="232" alt="image" src="https://github.com/user-attachments/assets/c6b45136-b5a5-4f05-9f38-1923a00329b1" />

## 컴포넌트 구조 설계

### 1. 합성 컴포넌트 패턴

합성 컴포넌트(Compound Component)는 루트 컴포넌트에서 상태를 관리하고, Context API를 통해 자식 컴포넌트에서 이 상태에 접근할 수 있도록 하는 패턴입니다. 이 패턴을 선택한 이유는 다음과 같습니다.

1. **유연한 조합**: 필요한 서브 컴포넌트만 선택적으로 사용할 수 있습니다.
2. **확장성**: 새로운 서브 컴포넌트를 추가하기 쉽습니다.
3. **관심사 분리**: 각 서브 컴포넌트가 자신의 역할에만 집중합니다.
4. **선언적 API**: 사용하는 측에서 구조를 명확하게 파악할 수 있습니다.

### 2. 하이브리드 Controlled 컴포넌트 방식

Select는 **선택값(`value`)만 제어**하고, 드롭다운 열림/닫힘, 키보드 하이라이트 등은 내부에서 관리하는 **하이브리드 Controlled 방식**을 채택했습니다.

**채택 이유**

1. **핵심 상태만 제어**: 사용자가 관심 있는 것은 "어떤 값이 선택되었는가"입니다. 드롭다운이 열렸는지, 어떤 옵션이 하이라이트되었는지는 UI 구현 세부사항이므로 내부에서 처리합니다.
2. **폼 연동 용이**: `value`와 `onChange`만 제공하면 React Hook Form, Formik 등 폼 라이브러리와 쉽게 연동할 수 있습니다.
3. **복잡도 감소**: 모든 상태를 외부로 노출하면 사용자가 `isOpen`, `highlightedIndex` 등을 모두 관리해야 해 불필요하게 복잡해집니다.
4. **네이티브 select와 유사한 API**: HTML `<select>` 요소처럼 값만 제어하는 익숙한 패턴을 따릅니다.

```tsx
// 부분 제어 방식 - 값만 외부에서 제어
<Select value={selected} onChange={setSelected}>
  <Select.Label>프레임워크 선택</Select.Label>
  <Select.Trigger>선택하세요</Select.Trigger>
  <Select.List>
    <Select.Option value="react">React</Select.Option>
    <Select.Option value="vue">Vue</Select.Option>
  </Select.List>
</Select>
```

### 3. 컴포넌트 구성

| 컴포넌트         | 역할                                        |
| ---------------- | ------------------------------------------- |
| `Select` (Root)  | 상태 관리 및 Context Provider               |
| `Select.Label`   | 접근성을 위한 라벨 (`aria-labelledby` 연결) |
| `Select.Trigger` | 드롭다운 토글 버튼, 키보드 이벤트 처리      |
| `Select.List`    | 옵션 목록 컨테이너 (`role="listbox"`)       |
| `Select.Option`  | 개별 옵션 아이템 (`role="option"`)          |
| `Select.Group`   | 옵션 그룹핑 (`role="group"`)                |

### 4. 상태 관리

루트 컴포넌트에서 관리하는 상태값

| 상태               | 타입                  | 설명                              |
| ------------------ | --------------------- | --------------------------------- |
| `isOpen`           | `boolean`             | 드롭다운 열림 여부                |
| `selectedValue`    | `string \| undefined` | 현재 선택된 옵션의 value          |
| `highlightedIndex` | `number`              | 키보드로 하이라이트된 옵션 인덱스 |
| `options`          | `SelectOption[]`      | 등록된 옵션 목록                  |

추가로 접근성을 위한 ID 값들(`listboxId`, `labelId`)과 트리거 버튼의 ref(`triggerRef`)를 Context로 공유합니다.

## 고민한 부분

### 1. 옵션 등록 방식

합성 컴포넌트 패턴에서 키보드 네비게이션을 구현하려면 전체 옵션 목록을 알아야 합니다. 하지만 자식 컴포넌트가 동적으로 렌더링되기 때문에 부모가 자식의 정보를 직접 알 수 없습니다.

이를 해결하기 위해 `children`을 재귀적으로 파싱해 옵션 목록을 수집하는 방식을 적용했습니다.

```tsx
// SelectRoot.tsx - children을 파싱하여 옵션 목록 수집
const options = useMemo(() => {
  const collectOptions = (
    children: ReactNode,
    collected: SelectOptionData[] = []
  ): SelectOptionData[] => {
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      const props = child.props as PropsWithChildren;

      if (child.type === SelectOption) {
        const optionProps = props as SelectOptionProps;
        collected.push({
          value: optionProps.value,
          children: optionProps.children,
          disabled: optionProps.disabled ?? false,
        });
      } else if (child.type === SelectGroup && props.children) {
        collectOptions(props.children, collected);
      } else if (props.children) {
        collectOptions(props.children, collected);
      }
    });
    return collected;
  };

  return collectOptions(children);
}, [children]);
```

`children` prop이 변경될 때마다 옵션 목록을 재계산하므로, 동적으로 옵션이 추가되거나 제거되는 경우에도 올바르게 동작합니다. 또한 `SelectGroup`을 통한 중첩 구조도 재귀적으로 처리할 수 있습니다.

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
