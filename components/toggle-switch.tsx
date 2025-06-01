import React, { useState } from 'react';

interface ToggleSwitchProps {
  initialChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  // You can add more props like id, name, disabled, etc. if needed
}

export default function ToggleSwitch({
  initialChecked = false,
  onChange,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <label className="relative inline-block w-10 h-5 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="opacity-0 w-0 h-0 peer" // 'peer' class is crucial for peer-checked styling
      />
      <span
        className={`
          absolute top-0 left-0 right-0 bottom-0 
          bg-gray-300 
          rounded-full 
          transition-colors duration-200 ease-in-out
          peer-checked:bg-[#06d6a0] 
          before:content-[''] 
          before:absolute 
          before:h-4 before:w-4 
          before:left-[2px] before:bottom-[2px] 
          before:bg-white 
          before:rounded-full 
          before:transition-transform before:duration-200 before:ease-in-out
          peer-checked:before:translate-x-5
        `}
      ></span>
    </label>
  );
};
