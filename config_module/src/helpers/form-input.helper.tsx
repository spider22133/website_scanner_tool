import { useState } from 'react';

export const useInput = (initialValue: string): [string, (e: React.FormEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return [value, handleChange];
};
