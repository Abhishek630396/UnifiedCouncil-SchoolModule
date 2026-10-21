import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const PillSelector = ({ value, onChange, options, name, className = "" }) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={`flex flex-wrap gap-2 ${className}`.trim()}
    >
      {options.map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;
        const isActive = value === optionValue;

        return (
          <label
            key={optionValue}
            htmlFor={`${name}-${optionValue}`}
            className={`flex cursor-pointer items-center rounded-full border px-3 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-slate-50"
            }`}
          >
            <RadioGroupItem value={optionValue} id={`${name}-${optionValue}`} className="sr-only" />
            <span>{optionLabel}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
};
