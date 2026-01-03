import { ChangeEvent } from "react";

type FieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "decimal" | "numeric" | "text";
  listId?: string;
};

const Field = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  inputMode = "text",
  listId,
}: FieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm uppercase tracking-widest text-ink-200"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        list={listId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-ink-800/70 px-2 py-1 text-base text-ink-100 outline-none transition focus:border-highlight-400 focus:ring-2 focus:ring-highlight-400/40 ${
          error ? "border-red-400/70" : "border-ink-600/50"
        }`}
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
};

export default Field;
