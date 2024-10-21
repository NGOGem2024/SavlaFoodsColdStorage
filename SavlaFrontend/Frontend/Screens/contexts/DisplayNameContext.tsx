// CustomerContext.tsx
import React, { createContext, useContext, useState } from 'react';

type CustomerContextType = {
  customerID: string | null;
  setCustomerID: (id: string | null) => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerID, setCustomerID] = useState<string | null>(null);

  return (
    <CustomerContext.Provider value={{ customerID, setCustomerID }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};



type DisplayNameContextType = {
  displayName: string | null;
  setDisplayName: (name: string | null) => void;
};

const DisplayNameContext = createContext<DisplayNameContextType | undefined>(undefined);

export const DisplayNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);

  return (
    <DisplayNameContext.Provider 
      value={{ 
        displayName, 
        setDisplayName 
      }}
    >
      {children}
    </DisplayNameContext.Provider>
  );
};

export const useDisplayName = () => {
  const context = useContext(DisplayNameContext);
  if (context === undefined) {
    throw new Error('useDisplayName must be used within a DisplayNameProvider');
  }
  return context;
};
