import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Cursor.css';
import { useCursor } from './CursorContext';

const Cursor = () => {
  const { cursor, cursorFollower } = useCursor();
  const textRef = useRef(null);

  useEffect(() => {
    const cursorElement = cursor.current;
    const followerElement = cursorFollower.current;

    const moveCursor = (e) => {
      gsap.to(cursorElement, {
        duration: 0.25,
        x: e.clientX - 3,
        y: e.clientY - 3,
        ease: "elastic.out(1, 0.1)",
      });
      gsap.to(followerElement, {
        opacity: 1,
        duration: 0.5,
        x: e.clientX - 10,
        y: e.clientY - 10,
        ease: "circ.out",
      });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursor, cursorFollower]);

  useEffect(() => {
    const cursorHovers = document.querySelectorAll(".cursor-hover");

    cursorHovers.forEach((cursorHover) => {
      cursorHover.addEventListener("mouseover", () => {
        gsap.to(cursorFollower.current, {
          scale: 3,
          duration: 0.3,
        });
      });

      cursorHover.addEventListener("mouseleave", () => {
        gsap.to(cursorFollower.current, {
          scale: 1,
          duration: 0.3,
        });
      });
    });

    return () => {
      cursorHovers.forEach((cursorHover) => {
        cursorHover.removeEventListener("mouseover", () => { });
        cursorHover.removeEventListener("mouseleave", () => { });
      });
    };
  }, [cursorFollower]);

  return (
    <>
      <div className="cursor" ref={cursor}></div>
      <div className="cursor-follower" ref={cursorFollower}>
        <span ref={textRef} className="cursor-text"></span>
      </div>
    </>
  );
};

export default Cursor;
