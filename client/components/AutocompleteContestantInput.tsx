import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Label } from "./ui/Label";
import Button from "./ui/Button";
import { cn } from "./ui/utils";
import type { User } from "../src/types/types";

type Props = {
  allUsers: User[];
  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;
};

const AutocompleteContestantInput = ({ allUsers, selectedUsers, setSelectedUsers }: Props) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const filteredUsers = allUsers.filter(
      (u) =>
        u.first_name?.toLowerCase().includes(lowerQuery) &&
        !selectedUsers.some((sel) => sel.user_id === u.user_id)
    );
    setFiltered(filteredUsers);
  }, [query, allUsers, selectedUsers]);

  const addUser = (user: User) => {
    if (selectedUsers.find((u) => u.user_id === user.user_id)) return;
    setSelectedUsers([...selectedUsers, user]);
    setQuery("");
    setShowDropdown(false);
  };

  const removeUser = (index: number) => {
    const updated = [...selectedUsers];
    updated.splice(index, 1);
    setSelectedUsers(updated);
  };

  const handleEnter = () => {
    if (filtered.length > 0) {
      addUser(filtered[0]);
    }
  };

  return (
    <div className="space-y-3 relative">
      <Label>Contestants</Label>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleEnter();
            }
          }}
          placeholder="Add contestant name"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
        />
        <Button onClick={handleEnter} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 border bg-white rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((user) => (
            <li
              key={user.user_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => addUser(user)}
            >
              {`${user.first_name} ${user.last_name}`}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedUsers.map((user, i) => (
          <div
            key={user.user_id}
            className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md"
          >
            <span>{`${user.first_name} ${user.last_name}`}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeUser(i)}
              className="h-auto p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutocompleteContestantInput;