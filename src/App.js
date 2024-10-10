import React, { Suspense } from 'react';
import './App.css';
import './output.css';
import Cursor from './Components/Cursor/Cursor';
import Header from './Components/Header/Header';
import LenisScroll from './Components/LenisScroll';
import { CursorProvider } from './Components/Cursor/CursorContext';
import Landing from './Components/UpperPart/Landing/Landing';

// Lazy load components
const About = React.lazy(() => import('./Components/UpperPart/About/About'));
const Skills = React.lazy(() => import('./Components/Skills/Skills'));
const Projects = React.lazy(() => import('./Components/Projects/Projects'));
const Time = React.lazy(() => import('./Components/Time/Time'));
const Contact = React.lazy(() => import('./Components/Contact/Contact'));

const App = () => {
  return (
    <>
      <CursorProvider>
        <LenisScroll>
          <Header />
          <Cursor />
          <main>
            <Suspense fallback={
              <h1 className='text-3xl text-white w-full text-center absolute top-1/3 animate-pulse'>Loading...</h1>
            }>
              <Landing />
              <About />
              <Skills />
              <Projects />
              <Time />
              <Contact />
              {/* <section className="space" style={{ width: "100%", height: "10rem" }}></section> */}
              {/* <Landing infinite={true} /> */}
            </Suspense >
          </main>
        </LenisScroll >
      </CursorProvider >
    </>
  );
};

export default App;
