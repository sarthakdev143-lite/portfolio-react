import React, { createContext, useContext, useRef } from 'react';

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
    const cursor = useRef(null);
    const cursorFollower = useRef(null);

    return (
        <CursorContext.Provider value={{ cursor, cursorFollower }}>
            {children}
        </CursorContext.Provider>
    );
};

export const useCursor = () => useContext(CursorContext);
