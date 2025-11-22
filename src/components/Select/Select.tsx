import { SelectLabel } from "./SelectLabel";
import { SelectOption } from "./SelectOption";
import { SelectPopup } from "./SelectPopup";
import { SelectRoot } from "./SelectRoot";
import { SelectTrigger } from "./SelectTrigger";

const Select = Object.assign(SelectRoot, {
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Popup: SelectPopup,
  Option: SelectOption,
});

export default Select;
