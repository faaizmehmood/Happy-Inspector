import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// Create the context
const UserDataContext = createContext({});

// Create a provider component
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getDataFromSecureStorage = async () => {
      try {
        const data = await SecureStore.getItemAsync("userData");
        // console.log('data in context', data)

        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (e) {
        console.log("Error getting data", e);
      }
    };

    getDataFromSecureStorage();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook to use the user data context
export const userContext = () => {
  return useContext(UserDataContext);
};
