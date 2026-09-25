import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  isDataInserted: boolean;
  insertData: () => void;
  clearData: () => void;
  lastUpdated: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDataInserted, setIsDataInserted] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const insertData = () => {
    setIsDataInserted(true);
    setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
  };

  const clearData = () => {
    setIsDataInserted(false);
    setLastUpdated(null);
  };

  return (
    <DataContext.Provider value={{ isDataInserted, insertData, clearData, lastUpdated }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
