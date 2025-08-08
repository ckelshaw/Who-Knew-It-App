import Select, { type ActionMeta, type OnChangeValue, type StylesConfig } from 'react-select';
//import type { User } from '../../shared/types/types';
import { User } from '../../shared/classes/User';

type Option = {
    value: string;
    label: string;
    isFixed?: boolean
}

type Props = {
    users: User[];
    theHouse: User | undefined;
    selected: string[];
    onChange: (userIds: string []) => void;
}

const UserMultiSelect = ({ users, theHouse, selected, onChange }: Props) => {
  const options: Option[] = users.map((u) => ({
    value: u.userId,
    label: u.concattedName,
    isFixed: u.userId === theHouse?.userId
  }));

  // Sort so fixed values always appear first
  const orderOptions = (values: readonly Option[]) => {
    return values.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed));
  };

  // Current selected values (ensuring House is always included)
  const selectedOptions = orderOptions(
    options.filter((opt) => selected.includes(opt.value) || opt.isFixed)
  );

    // Styles to make fixed values look different & hide remove button
  const styles: StylesConfig<Option, true> = {
    multiValue: (base, state) =>
      state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base,
    multiValueLabel: (base, state) =>
      state.data.isFixed
        ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
        : base,
    multiValueRemove: (base, state) =>
      state.data.isFixed ? { ...base, display: 'none' } : base,
  };

  // Handle selection changes
  const handleChange = (newValue: OnChangeValue<Option, true>, actionMeta: ActionMeta<Option>) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return; // Don't allow removing fixed values
        }
        break;
      case 'clear':
        newValue = options.filter((v) => v.isFixed); // Reset to fixed values only
        break;
    }
    const ids = orderOptions(newValue).map((opt) => opt.value);
    onChange(ids);
  };

  return (
    <div className="mt-2 mb-4">
      <label className="font-medium block mb-2">Select Contestants:</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        styles={styles}
        isClearable={selectedOptions.some((v) => !v.isFixed)}
        placeholder="Type to search..."
      />
    </div>
  );
};

export default UserMultiSelect;
