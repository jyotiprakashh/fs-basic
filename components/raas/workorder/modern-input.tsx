"use client";

interface ModernInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  helpText?: string;
}

export function ModernInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helpText,
}: ModernInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b-2 border-border focus:border-orange-500 outline-none transition-colors pb-2 text-base font-medium placeholder:text-muted-foreground/50"
      />
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
