// A Loader Context to manage the loading state of the app
import React, { createContext, useState } from "react";

// Create the context
export const RoomContext = createContext();

// Create a provider component
export const RoomProvider = ({ children }) => {
    const [iconData, setIconData] = useState({});

    return (
        <RoomContext.Provider value={{ iconData, setIconData }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useImgProvider = () => {
    return React.useContext(RoomContext);
};
