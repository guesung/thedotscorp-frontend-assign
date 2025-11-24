import { useId, type PropsWithChildren } from 'react';

interface SelectGroupProps extends PropsWithChildren {
  label: string;
}

export function SelectGroup({ label, children }: SelectGroupProps) {
  const groupId = useId();

  return (
    <li role="presentation">
      <ul role="group" aria-labelledby={groupId}>
        <li
          id={groupId}
          role="presentation"
          className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          {label}
        </li>
        {children}
      </ul>
    </li>
  );
}
