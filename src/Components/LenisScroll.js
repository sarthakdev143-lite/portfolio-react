import React from 'react';
import { LenisProvider } from './LenisContext';

const LenisScroll = ({ children }) => {
    return (
        <LenisProvider>
            <div data-lenis-container>
                {children}
            </div>
        </LenisProvider>
    );
};

export default LenisScroll;
