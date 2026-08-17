import { Search } from "lucide-react";
import type { ReactNode } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  right?: ReactNode;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Rechercher...",
  right,
}: SearchBarProps) => (
  <div className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-white p-4 md:flex-row md:items-center">
    <div className="flex flex-1 items-center gap-3 rounded-2xl bg-(--surface) px-4 py-3">
      <Search size={18} className="text-(--brown)" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none"
      />
    </div>
    {right}
  </div>
);

export default SearchBar;
