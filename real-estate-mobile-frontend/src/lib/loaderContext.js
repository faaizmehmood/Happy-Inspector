// A Loader Context to manage the loading state of the app
import React, { createContext, useState } from "react";

// Create the context
export const LoaderContext = createContext();

// Create a provider component
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  return React.useContext(LoaderContext);
};
