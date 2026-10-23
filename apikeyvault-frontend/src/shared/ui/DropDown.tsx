import { useState } from "react";
import { Button, Card } from "pixel-retroui";

type DropDownProps<T> = {
  ariaLabel: string;
  dropDownOptions: T[];
  disabled?: boolean;
  getOptionsKey: (option: T) => string | number;
  getOptionsLabel: (option: T) => string;
  onSelect: (option: T) => void;
};

export function DropDown<T>({
  ariaLabel,
  dropDownOptions,
  disabled = false,
  getOptionsKey,
  getOptionsLabel,
  onSelect,
}: DropDownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  function selectOption(option: T) {
    if (disabled) {
      return;
    }

    setIsOpen(false);
    onSelect(option);
  }

  return (
    <div className="relative">
      <Button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        bg="var(--success)"
        borderColor="var(--border)"
        className="m-0! inline-flex! h-6! w-6! items-center! justify-center! p-0!"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        shadow="var(--shadow)"
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          lineHeight: 1,
        }}
        textColor="var(--success-on-color)"
        type="button"
      >
        <span
          aria-hidden="true"
          className="pixelart-icons-font-plus text-[24px]! leading-none!"
          style={{ position: "relative", left: "-1px", top: "-1px" }}
        />
      </Button>

      {isOpen && !disabled && (
        <Card
          bg="var(--success)"
          borderColor="var(--border)"
          className="absolute left-0! top-full z-10 min-w-full p-0!"
          style={{ marginLeft: 0, marginTop: "4px" }}
          shadowColor="var(--shadow)"
          textColor="var(--success-on-color)"
        >
          <div aria-label={`${ariaLabel} options`} role="menu">
            {dropDownOptions.map((option) => (
              <button
                className="block w-full cursor-pointer border-0! bg-transparent! px-1! py-px! text-left text-[11px]! text-success-on-color! hover:bg-success-on-color! hover:text-success! focus:bg-success-on-color! focus:text-success!"
                key={getOptionsKey(option)}
                onClick={() => selectOption(option)}
                role="menuitem"
                type="button"
              >
                {getOptionsLabel(option)}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
