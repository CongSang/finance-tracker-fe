'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { cleanAmount, formatDisplay } from '@/lib/index';

interface InputProps {
  name?: string;
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  inputClass?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const Input = ({ name, label, value, placeholder, type = "text", disabled, isSelect, options, inputClass, onChange }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const toggleShowPassword = () => {
      setShowPassword(!showPassword);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const inputVal = e.target.value;
    const numericValue = cleanAmount(inputVal);

    if (/^\d*\.?\d*$/.test(numericValue)) {
      setDisplayValue(formatDisplay(numericValue));

      const customEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue,
          name: name
        }
      } as ChangeEvent<HTMLInputElement>;

      onChange(customEvent);
    }
  }

  useEffect(() => {
    setDisplayValue(formatDisplay(value))
  }, [value])

  return (
    <div className='w-full'>
        <label className="block text-sm max-sm:text-xs font-semibold mb-1">
            {label}
        </label>

        <div className="relative">
            {isSelect ? (
                <select 
                  name={name}
                  disabled={disabled}
                  className={twMerge("w-full px-4 py-3 rounded-lg border border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-third", inputClass)}
                  value={value}
                  onChange={(e) => onChange(e)}
                >
                  <option value="">{placeholder}</option>
                  {options?.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
            ) : (type === "number") ? (
                <input
                  name={name}
                  disabled={disabled}
                  type="text"
                  value={displayValue}
                  onChange={(e) => handleNumberChange(e)}
                  placeholder={placeholder}
                  min={0}
                  className={twMerge("w-full px-4 py-3 rounded-lg border border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-third", inputClass)}
                />
            ) : (
                <input
                  name={name}
                  disabled={disabled}
                  type={type === "password" ? (showPassword ? "text" : "password") : type}
                  value={value}
                  onChange={(e) => onChange(e)}
                  placeholder={placeholder}
                  className={twMerge("w-full px-4 py-3 rounded-lg border border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-third", inputClass)}
                />
            )}

            {type === "password" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    {showPassword ? (
                        <Eye size={18} className='text-primary' onClick={toggleShowPassword} />
                    ) : (
                        <EyeOff size={18} className='text-slate-400' onClick={toggleShowPassword} />
                    )}
                </span>
            )}
        </div>
    </div>
  );
}