import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Landing.css';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const MyCanvas = React.memo(({ canvasRef }) => {
  return (
    <div id="parent" className="w-full min-h-[600vh] relative -mt-20">
      <figure className="w-full h-screen sticky top-0">
        <canvas ref={canvasRef} className="w-full h-screen" />
      </figure>
    </div>
  );
});

const Landing = ({ infinite }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const frames = useRef({ currentIndex: 0, maxIndex: 257 });

  const preloadImgs = useCallback(async () => {
    const promises = [];
    for (let i = 1; i <= frames.current.maxIndex; i++) {
      const imgUrl = `./frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
      const img = new Image();
      img.src = imgUrl;
      promises.push(new Promise((resolve) => {
        img.onload = () => resolve(img);
      }));
    }

    const loadedImages = await Promise.all(promises);
    setImages(loadedImages);
    loadImages(frames.current.currentIndex, loadedImages);
    startAnimation(loadedImages);
  }, []);

  const loadImages = useCallback((index, imgs) => {
    if (index < 0 || index >= frames.current.maxIndex) return;
    const img = imgs[index];
    if (!img) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.max(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;
    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    frames.current.currentIndex = index;
  }, []);

  const startAnimation = useCallback((imgs) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#parent",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });

    tl.to(frames.current, {
      currentIndex: frames.current.maxIndex,
      onUpdate: () => {
        loadImages(Math.floor(frames.current.currentIndex), imgs);
      },
    });
  }, [loadImages]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
    const lenis = new Lenis({
      duration: 4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      useNativeScroll: true,
      pauseOnResize: true,
      velocity: 0.001,
    });

    const handleRaf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(handleRaf);
    };
    requestAnimationFrame(handleRaf);

    preloadImgs();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [preloadImgs]);

  useGSAP(() => {
    gsap.to('.nameScroll', {
      x: -250,
      ease: 'none',
      scrollTrigger: {
        trigger: '.nameScrollDiv',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, []);

  return (
    <>
      <section className='intro-image'>
      <figcaption className='z-10'>&ldquo;Who&apos;s Shaping the Web?&rdquo;</figcaption>
        <Suspense fallback={
          <h1 className='text-6xl text-white w-full text-center absolute top-1/3 animate-pulse'>Loading...</h1>
        }>
          <MyCanvas canvasRef={canvasRef} />
        </Suspense>
      </section>
      {!infinite && <div className="nameScrollDiv">
        <h1 className='nameScroll'>
          Sarthak Parulekar • Sarthak Parulekar • Sarthak Parulekar • Sarthak Parulekar • Sarthak Parulekar • Sarthak Parulekar
        </h1>
      </div>}
    </>
  );
}

export default Landing;
