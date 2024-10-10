import React, { useEffect, useRef } from 'react';
import './StylishHeading.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StylishHeading = ({ source }) => {
    const headingWrapperRef = useRef(null);

    useEffect(() => {
        const headingWrapper = headingWrapperRef.current;
        const beforeLetters = gsap.utils.toArray('.before span', headingWrapper);
        const mainHeading = headingWrapper.querySelector('#catching-heading');
        const highlightedSpan = headingWrapper.querySelector('.stylish, .shine');

        // Set initial states
        gsap.set(beforeLetters, { opacity: 0, scale: 0, rotation: -180 });
        gsap.set(mainHeading, { opacity: 1, y: 0 }); // Ensure main heading is visible initially
        gsap.set(highlightedSpan, { opacity: 1, scale: 1 }); // Ensure highlighted span is visible initially

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: headingWrapper,
                start: 'top 90%',
                end: 'top 30%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        tl.to(beforeLetters, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: 'back.out(4)',
            stagger: {
                each: 0.1,
                from: 'random'
            }
        })
        .from(mainHeading, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        }, 0) // Start at the beginning of the timeline
        .from(highlightedSpan, {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            ease: 'elastic.out(1, 0.3)',
        }, 0.3); // Start slightly after the main heading animation

    }, [source]);

    return (
        <div className={`heading-wrapper heading-wrapper-${source}`} ref={headingWrapperRef}>
            {source === 'projects' && (
                <>
                    <h1 id='catching-heading'>
                        Some <span className='stylish'>"flawless"</span> Creations.
                    </h1>
                    <h1 className="before">
                        {'FLAWLESS'.split('').map((letter, index) => (
                            <span key={index}>{letter}</span>
                        ))}
                    </h1>
                </>
            )}

            {source === 'skills' && (
                <>
                    <h1 id='catching-heading'>
                        Areas Where I <span className="shine">"Shine"</span>.
                    </h1>
                    <h1 className="before">
                        {'SHINE'.split('').map((letter, index) => (
                            <span key={index}>{letter}</span>
                        ))}
                    </h1>
                </>
            )}
        </div>
    );
};

export default StylishHeading;
