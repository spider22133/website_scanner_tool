import React, { createContext, useContext, useState, FC } from 'react';
import { errorObj } from '../interfaces/error.interface';

type APIErrorType = {
  error: errorObj | null;
  addError: (message: string, status: number) => void;
  removeError: () => void;
};

const APIErrorContext = createContext<APIErrorType>({
  error: null,
  addError: () => ({}),
  removeError: () => ({}),
});

export const useAPIError = () => useContext(APIErrorContext);

export const APIErrorProvider: FC = ({ children }) => {
  const [error, setError] = useState<errorObj | null>(null);

  const addError = (message: string, status: number) => setError({ message, status });
  const removeError = () => setError(null);

  return <APIErrorContext.Provider value={{ error, addError, removeError }}>{children}</APIErrorContext.Provider>;
};
