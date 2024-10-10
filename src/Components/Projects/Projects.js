import React, { useRef, useEffect, useState } from 'react';
import './Projects.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import StylishHeading from '../StylishHeading/StylishHeading';
import Window10 from './media/window10.webm';
import Orizon from './media/orizon.webm';
import texture from './media/texture.avif';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ScratchCard = ({ videoSrc, textureSrc }) => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let isDrawing = false;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const img = new Image();
        img.src = textureSrc;
        img.onload = () => {
            const pattern = ctx.createPattern(img, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px "Comic Sans MS", cursive, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 15;
            ctx.fillText('Scratch Me', canvas.width / 2, canvas.height / 2);
            ctx.shadowBlur = 0;
        };

        const scratch = (x, y) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        };

        const checkReveal = () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let scratchedPixels = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] === 0) scratchedPixels++;
            }
            if (scratchedPixels / (canvas.width * canvas.height) > 0.45) {
                setIsRevealed(true);
                videoRef.current.play();
            }
        };

        const handleMouseMove = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            scratch(x, y);
            checkReveal();
        };

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousedown', () => isDrawing = true);
            canvas.removeEventListener('mouseup', () => isDrawing = false);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [textureSrc]);

    return (
        <figure className="scratch-card">
            <video ref={videoRef} src={videoSrc} loop playsInline />
            <canvas ref={canvasRef} style={{ opacity: isRevealed ? 0 : 1 }} />
        </figure>
    );
};

const Projects = () => {
    const projectsRef = useRef(null);
    const projectRefs = useRef([]);

    const projects = [
        { name: 'Orizon Onestrong Clone', media: Orizon, tags: ['react', 'css'], description: 'This Project is The Clone Of <a class="highlight" href="https://orizon.1onestrong.com/" target="_blank" rel="noopener noreferrer">orizon.1onestrong.com</a>.', link: 'https://sarthakdev-orizon.netlify.app/' },
        { name: 'Window 10', media: Window10, tags: ['html', 'css', 'javascript'], description: 'A try to mimic the UI of Window 10 with some of its functionalities like "start menu" & "notification menu".', link: 'https://sarthakdev143.github.io/Window-10-Webpage/' }
    ];

    useGSAP(() => {
        const ctx = gsap.context(() => {
    
            projectRefs.current.forEach((project, index) => {
                gsap.from(project, {
                    scale: 0.9, // Start smaller
                    opacity: 0,
                    duration: 2,
                    ease: 'back.out(1.7)', // Smooth zoom-in with slight bounce
                    scrollTrigger: {
                        trigger: project,
                        start: 'top bottom-=50',
                        toggleActions: 'play none none reverse'
                    }
                });                
                
                // Add a subtle floating effect on hover or after appearing
                // gsap.to(project, {
                //     y: '+=10', // Floating up and down
                //     repeat: -1, // Infinite loop
                //     yoyo: true, // Reverse the animation
                //     duration: 2,
                //     ease: 'sine.inOut' // Smooth sine wave movement
                // });
                
                // gsap.from(project, {
                //     opacity: 0,
                //     filter: 'blur(10px)', // Start blurred
                //     duration: 1.8,
                //     ease: 'power4.out',
                //     scrollTrigger: {
                //         trigger: project,
                //         start: 'top bottom-=100',
                //         toggleActions: 'play none none reverse'
                //     }
                // });                               
    
                // Animate project details with stagger and easing
                gsap.from(project.querySelectorAll('h1, p, .tags'), {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.3, // Adding stagger for a flowing effect
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: project,
                        start: 'top bottom-=250',
                        toggleActions: 'play none none reverse',
                    }
                });
            });
    
            gsap.from('.view-all', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.projects-wrapper',
                    start: 'bottom bottom-=50',
                    toggleActions: 'play none none reverse',
                    // Remove markers for production
                    // markers: true 
                }
            });
    
            // Parallax effect on project cards
            projectRefs.current.forEach((project) => {
                gsap.to(project, {
                    yPercent: -25, // Increase parallax movement
                    ease: 'none',
                    scrollTrigger: {
                        trigger: project,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true, // Smooth scrub for parallax
                    }
                });
            });
    
        }, projectsRef);
    
        return () => ctx.revert();
    }, []);    

    return (
        <section id="projects" ref={projectsRef}>
            <StylishHeading source={'projects'} />
            <div className="projects-wrapper">
                {projects.map((project, index) => (
                    <div key={index} className="hero-project" ref={el => projectRefs.current[index] = el}>
                        <ScratchCard videoSrc={project.media} textureSrc={texture} />
                        <figcaption>
                            <h1>{project.name}</h1>
                            <p dangerouslySetInnerHTML={{ __html: project.description }}></p>
                            <div className="tags">
                                {project.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </figcaption>
                    </div>
                ))}
            </div>
            <a href="https://github.com/sarthakDev143-lite?tab=repositories" target="_blank" rel="noopener noreferrer" className="view-all">View All <i className="icon ri-corner-down-right-line"></i></a>
        </section>
    );
};

export default Projects;