import { useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const updateValue = (nextValue: T) => {
    setValue(nextValue);
    localStorage.setItem(key, JSON.stringify(nextValue));
  };

  return [value, updateValue] as const;
}
