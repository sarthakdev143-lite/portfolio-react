import React, { useRef, useEffect } from 'react';
import './About.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pfp from './dp.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const triggerRef = useRef(null);

    useEffect(() => {
        const trigger = triggerRef.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: trigger,
                start: "top 85%",
                end: "top 20%",
                scrub: true,
            },
        });

        tl.fromTo(".sent.message", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.2 });
        tl.fromTo(".seen", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.2 }, "-=0.2");
        tl.fromTo(".received.message", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 });
        tl.to(".received #heart3", { 
            className: "ri-heart-3-fill heart active",
        })

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
            ScrollTrigger.clearScrollMemory();
        };
    }, []);

    const handleDoubleClick = (index) => {
        const heartElement = document.getElementById(`heart${index}`);
        if (heartElement) heartElement.classList.toggle('active');
    };

    return (
        <section id='about'>
            <div className="about">
                <article id="chatBlock" ref={triggerRef}>
                    <div className="sent message">
                        <div className="text">Heyy.. <span className='👋'>👋</span></div>
                        <img className="dp user-select-none" src={pfp} alt="Profile" />
                        <p className="seen">Seen just now</p>
                    </div>
                    <div className="reply">
                        <div className="received message">
                            <div
                                className="text"
                                onDoubleClick={() => handleDoubleClick(1)}
                                title="Double Click To Heart"
                            >
                                Hi.. <span className='👋'>👋</span>
                                <span className="dbc-to-💖">
                                    <i className="ri-information-line"></i>Double Click To Heart..
                                </span>
                            </div>
                            <i className="ri-heart-3-fill heart" id='heart1'></i>
                        </div>
                        <div className="received message">
                            <div
                                className="text"
                                onDoubleClick={() => handleDoubleClick(2)}
                                title='Double Click To Heart'
                            >
                                this is Sarthak Parulekar.
                                <span className="dbc-to-💖">
                                    <i className="ri-information-line"></i>Double Click To Heart..
                                </span>
                            </div>
                            <i className="ri-heart-3-fill heart" id='heart2'></i>
                        </div>
                        <div className="received message">
                            <img className="dp user-select-none" src={pfp} alt="Profile" />
                            <div
                                className="text"
                                onDoubleClick={() => handleDoubleClick(3)}
                                title='Double Click To Heart'
                            >
                                a certified full stack developer.
                                <span className="dbc-to-💖">
                                    <i className="ri-information-line"></i>Double Click To Heart..
                                </span>
                            </div>
                            <i className="ri-heart-3-fill heart" id='heart3'></i>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default About;
