import React, { createContext, useContext, useMemo, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisContext = createContext();

export const LenisProvider = ({ children }) => {
    const lenis = useMemo(() => new Lenis({
        duration: 5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        useNativeScroll: true,
        pauseOnResize: true,
        velocity: 0.001,
    }), []);

    useEffect(() => {
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [lenis]);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
};

export const useLenis = () => {
    const context = useContext(LenisContext);
    if (!context) {
        throw new Error('useLenis must be used within a LenisProvider');
    }
    return context;
};

