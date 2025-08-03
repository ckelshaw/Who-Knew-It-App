import Select, { type MultiValue } from 'react-select';
//import type { User } from '../../shared/types/types';
import { User } from '../../shared/classes/User';

type Option = {
    value: string;
    label: string;
}

type Props = {
    users: User[];
    selected: string[];
    onChange: (userIds: string []) => void;
}

const UserMultiSelect = ({ users, selected, onChange }: Props) => {
  const options: Option[] = users.map((u) => ({
    value: u.userId,
    label: u.concattedName,
  }));

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  const handleChange = (newOptions: MultiValue<Option>) => {
    onChange(newOptions.map((opt) => opt.value));
  };

  return (
    <div className="mt-2 mb-4">
      <label className="font-medium block mb-2">Select Contestants:</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Type to search..."
      />
    </div>
  );
};

export default UserMultiSelect;
