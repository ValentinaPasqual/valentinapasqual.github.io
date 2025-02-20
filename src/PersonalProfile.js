import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import SimplifiedBookShelf from './SimplifiedBookShelf';

const PersonalProfile = () => {
  const tags = ['digital humanities', 'semantic web', 'information science', 'knowledge engineering', 'GLAM'];
  
  // Animations for text elements
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 800 },
    delay: 200
  });
  
  const nameAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.gentle,
    delay: 500
  });
  
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: config.gentle,
    delay: 800
  });
  
  const paragraphAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
    delay: 1000
  });
  
  const tagAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.wobbly,
    delay: 1200
  });
  
  const lineAnimation = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    config: { duration: 1200 },
    delay: 1500
  });

  // New animation for the bookshelf component
  const bookshelfAnimation = useSpring({
    from: { opacity: 0, transform: 'translateX(100px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: { tension: 120, friction: 14 },
    delay: 1800 // Starts after all other animations
  });

  return (
    <div className="fixed inset-0">
      {/* Stack vertically on small screens, position absolutely on large */}
      <div className="block lg:hidden w-full h-full">
        {/* Mobile layout - stacked */}
        <div className="px-8 max-w-xl mx-auto">
          <animated.h2 style={fadeIn} className="text-base md:text-lg">
            Hi, I am
          </animated.h2>
          
          <animated.h1 style={nameAnimation} className="text-5xl md:text-7xl tracking-wider">
            VALENTINA
          </animated.h1>
          <animated.h1 style={nameAnimation} className="text-5xl md:text-7xl tracking-wider">
            PASQUAL
          </animated.h1>
          
          <animated.h2 style={titleAnimation} className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-wider text-end">
            DIGITAL HUMANIST
          </animated.h2>
          
          <animated.p style={paragraphAnimation} className="text-sm text-justify leading-relaxed">
            PhD student at University of Bologna, mainly interested in Semantic Web technologies (LOD) applied to GLAM domain.
          </animated.p>
          
          <animated.div style={tagAnimation} className="flex flex-wrap gap-2 justify-start">
            {tags.map((tag, index) => (
              <animated.span 
                key={tag}
                style={useSpring({
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                  delay: 1200 + (index * 100)
                })}
                className="text-lg md:text-xl font-medium px-2.5 py-0.5 rounded border border-black"
              >
                {tag}
              </animated.span>
            ))}
          </animated.div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0">
          <SimplifiedBookShelf />
        </div>
      </div>

      {/* Desktop layout with overlay */}
      <div className="hidden lg:block h-full w-full">
        {/* Profile info */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-xl z-10">
          <animated.h2 style={fadeIn} className="text-lg">
            Hi, I am
          </animated.h2>
          
          <animated.h1 style={nameAnimation} className="text-7xl tracking-wider">
            VALENTINA
          </animated.h1>
          <animated.h1 style={nameAnimation} className="text-7xl tracking-wider">
            PASQUAL
          </animated.h1>
          
          <animated.h2 style={titleAnimation} className="text-5xl font-semibold tracking-wider text-end">
            DIGITAL HUMANIST
          </animated.h2>
          
          <animated.p style={paragraphAnimation} className="text-sm text-justify leading-relaxed">
            PhD student at University of Bologna, mainly interested in Semantic Web technologies (LOD) applied to GLAM domain.
          </animated.p>
          
          <animated.div style={tagAnimation} className="flex flex-wrap gap-2 justify-start">
            {tags.map((tag, index) => (
              <animated.span 
                key={tag}
                style={useSpring({
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                  delay: 1200 + (index * 100)
                })}
                className="text-xl font-medium px-2.5 py-0.5 rounded border border-black"
              >
                {tag}
              </animated.span>
            ))}
          </animated.div>
        </div>

        {/* Bookshelf that overlays - now with animation */}
        <animated.div style={bookshelfAnimation} className="fixed inset-0 z-10">
          <SimplifiedBookShelf />
        </animated.div>
      </div>

      <animated.div style={lineAnimation} className="fixed bottom-0 left-0 h-2 bg-black z-30"></animated.div>
    </div>
  );
};

export default PersonalProfile;