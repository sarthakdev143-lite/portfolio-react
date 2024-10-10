import React, { Suspense } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import StylishHeading from '../StylishHeading/StylishHeading';

gsap.registerPlugin(ScrollTrigger);

const SphereCanvas = React.lazy(() => import('./SphereCanvas'));

const Skills = () => {

    return (
        <>
            <section id='skills' className='flex flex-col gap-14'>
                <StylishHeading source={'skills'} />
                <Suspense fallback={
                    <h1 className='text-6xl text-white w-full text-center absolute top-1/3 animate-pulse'>Loading...</h1>
                }>
                    <SphereCanvas />
                </Suspense>
            </section>
        </>
    );
};

export default Skills;