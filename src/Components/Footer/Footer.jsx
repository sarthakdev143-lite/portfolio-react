import React, { useRef, useEffect } from 'react';
import './Footer.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const triggerRef = useRef(null);
    const footerRef = useRef(null);
    const contentRef = useRef(null);
    const lenis = useRef(null);

    useEffect(() => {
        // Initialize Lenis
        lenis.current = new Lenis({
            smooth: true,
            direction: 'vertical', // or 'horizontal'
            smoothTouch: true,
        });

        const scrollFn = (time) => {
            lenis.current.raf(time);
            requestAnimationFrame(scrollFn);
        };
        requestAnimationFrame(scrollFn);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.current.on('scroll', ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(window, {
            scrollTop(value) {
                return arguments.length ? lenis.current.scrollTo(value) : lenis.current.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
        });

        // ScrollTrigger animations
        gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'top 100%',
                end: 'top 40%',
                scrub: true,
                scroller: window, // Lenis uses the default window as the scroller
            }
        }).to(footerRef.current, {
            opacity: 1,
            width: '60%',
            ease: "power4.out",
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'top 60%',
                end: 'top 30%',
                scrub: true,
                scroller: window, // Lenis uses the default window as the scroller
            }
        }).to(contentRef.current, {
            opacity: 1,
        });

        // Clean up on unmount
        return () => {
            lenis.current.destroy();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <div id="footer-wrapper" ref={triggerRef}>
            <div id="footer" ref={footerRef}>
                <div className="scrollable-content" ref={contentRef}>
                    {/* Footer content here */}
                </div>
            </div>
        </div>
    );
};

export default Footer;
