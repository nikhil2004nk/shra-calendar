import React from "react";

interface GlobalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Search by movie, event, or type..."
        className="w-full rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
