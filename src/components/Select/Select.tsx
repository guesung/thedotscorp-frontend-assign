import { SelectGroup } from './SelectGroup';
import { SelectLabel } from './SelectLabel';
import { SelectList } from './SelectList';
import { SelectOption } from './SelectOption';
import { SelectRoot } from './SelectRoot';
import { SelectTrigger } from './SelectTrigger';

const Select = Object.assign(SelectRoot, {
  Label: SelectLabel,
  Trigger: SelectTrigger,
  List: SelectList,
  Option: SelectOption,
  Group: SelectGroup,
});

export default Select;
