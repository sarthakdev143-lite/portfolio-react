import React, { useRef, useEffect, useMemo, useState } from 'react';
import TailwindCSSLogo from './imgs/TailwindCSS.svg';
import SpringLogo from './imgs/Spring.svg';
import CPPLogo from './imgs/CPP.svg';
import JavascriptLogo from './imgs/Javascript.svg';
import FigmaLogo from './imgs/Figma.svg';
import GitLogo from './imgs/Git.svg';
import ReactLogo from './imgs/React.webp';
import CSS3Logo from './imgs/CSS3.svg';
import HTML5Logo from './imgs/HTML5.svg';
import JavaLogo from './imgs/Java.svg';
import GithubLogo from './imgs/Github.svg';
import MongoDBLogo from './imgs/MongoDB.svg';
import CLogo from './imgs/C.svg';
import BootstrapLogo from './imgs/Bootstrap.svg';
import GSAP from './imgs/GSAP.png';
import NextJS from './imgs/nextjs.svg';
import ViteJS from './imgs/Vitejs.webp';
import ThreeJS from './imgs/threejs.webp';

const SphereCanvas = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const angleRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);

  // Create a ref to store the radius value
  const radiusRef = useRef(window.innerWidth < 768 ? 150 : 215);

  const images = useMemo(
    () => [
      TailwindCSSLogo, SpringLogo, CPPLogo, ThreeJS, JavascriptLogo,
      FigmaLogo, ReactLogo, CSS3Logo, ViteJS, HTML5Logo,
      JavaLogo, GSAP, GithubLogo, MongoDBLogo, CLogo,
      BootstrapLogo, NextJS, GitLogo
    ],
    []
  );

  const numParticles = images.length;

  const Particle = useMemo(() => {
    return class {
      constructor(x, y, z, img) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.baseSize = window.innerWidth < 768 ? 25 : 37.5;
        this.img = img;
      }
      update(rotateX, rotateY) {
        const cosY = Math.cos(rotateY);
        const sinY = Math.sin(rotateY);
        const cosX = Math.cos(rotateX);
        const sinX = Math.sin(rotateX);

        const x1 = this.x * cosY - this.z * sinY;
        const z1 = this.z * cosY + this.x * sinY;
        const y1 = this.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + this.y * sinX;

        this.x = x1;
        this.y = y1;
        this.z = z2;
      }
      draw(ctx, canvasWidth, canvasHeight) {
        const perspective = canvasWidth / (canvasWidth + this.z);
        const x2D = (this.x * perspective) + canvasWidth / 2;
        const y2D = (this.y * perspective) + canvasHeight / 2;
        const scale = perspective * 1.5;
        const size = this.baseSize * scale;

        ctx.globalAlpha = (this.z + radiusRef.current) / (radiusRef.current * 1.5);
        ctx.drawImage(this.img, x2D - size / 2, y2D - size / 2, size, size);
        ctx.globalAlpha = 1;

        return { x: x2D, y: y2D, z: this.z };
      }
    };
  }, [radiusRef]);

  useEffect(() => {
    // Load images and set state logic...
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    const loadImagesSequentially = async () => {
      const newLoadedImages = [];
      for (let i = 0; i < images.length; i++) {
        try {
          const img = await loadImage(images[i]);
          newLoadedImages.push(img);
          setLoadedImages([...newLoadedImages]);
        } catch (error) {
          console.error('Failed to load image:', error);
        }
      }
    };
    loadImagesSequentially();
  }, [images]);

  useEffect(() => {
    if (loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function initParticles() {
      const phi = Math.PI * (3 - Math.sqrt(5));
      return loadedImages.map((img, i) => {
        const y = 1 - (i / (numParticles - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        return new Particle(x * radiusRef.current, y * radiusRef.current, z * radiusRef.current, img);
      });
    }

    const drawConnectionsOffscreen = (() => {
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');

      return (positions, width, height) => {
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const threshold = 245;
        offscreenCtx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
        offscreenCtx.lineWidth = 1;
        offscreenCtx.beginPath();
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const dx = positions[i].x - positions[j].x;
            const dy = positions[i].y - positions[j].y;
            if (dx * dx + dy * dy < threshold * threshold) {
              offscreenCtx.moveTo(positions[i].x, positions[i].y);
              offscreenCtx.lineTo(positions[j].x, positions[j].y);
            }
          }
        }
        offscreenCtx.stroke();
        return offscreenCanvas;
      };
    })();

    function animate(time) {
      if (!isVisible) return;

      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add constant rotation
        angleRef.current.x += 0.00001 * deltaTime;
        angleRef.current.y += 0.00001 * deltaTime;

        const positions = particlesRef.current.map(particle => {
          particle.update(angleRef.current.x, angleRef.current.y);
          return particle.draw(ctx, canvas.width, canvas.height);
        });

        const connectionsCanvas = drawConnectionsOffscreen(positions, canvas.width, canvas.height);
        ctx.drawImage(connectionsCanvas, 0, 0);

        angleRef.current.x *= 0.95;
        angleRef.current.y *= 0.95;
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      radiusRef.current = window.innerWidth < 768 ? 150 : 215; // Update ref value on resize
      particlesRef.current = initParticles(); // Reinitialize particles on resize
    }

    function handleMouseMove(event) {
      angleRef.current.x += (event.clientY / canvas.height - 0.5) * 0.01;
      angleRef.current.y += (event.clientX / canvas.width - 0.5) * 0.01;
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    particlesRef.current = initParticles();
    requestRef.current = requestAnimationFrame(animate);

    const observer = new IntersectionObserver(
      () => setIsVisible(true),
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
      observer.disconnect();
    };
  }, [loadedImages, Particle, numParticles, isVisible]);

  return <canvas ref={canvasRef} id="sphereCanvas" style={{ width: '100%', height: '100%' }} />;
};

export default SphereCanvas;