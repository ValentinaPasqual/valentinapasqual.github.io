import React, { useState } from 'react';
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

  // For tag hover animations
  const [hoveredTag, setHoveredTag] = useState(null);

  return (
    <div className="fixed inset-0">
      {/* Stack vertically on small screens, position absolutely on large */}
      <div className="block lg:hidden w-full h-full flex flex-col">
        {/* Mobile layout - presentation on top, bookshelf below */}
        <div className="px-8 py-12 max-w-xl mx-auto mb-auto space-y-8">
          <animated.h2 style={fadeIn} className="text-base md:text-lg mb-4">
            Hi, I am
          </animated.h2>
          
          <div className="space-y-2 mb-6">
            <animated.h1 style={nameAnimation} className="text-5xl md:text-7xl tracking-wider">
              VALENTINA
            </animated.h1>
            <animated.h1 style={nameAnimation} className="text-5xl md:text-7xl tracking-wider">
              PASQUAL
            </animated.h1>
          </div>
          
          <animated.h2 style={titleAnimation} className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-wider text-end mb-8">
            DIGITAL HUMANIST
          </animated.h2>
          
          <animated.p style={paragraphAnimation} className="text-sm text-justify leading-relaxed mb-10">
            PhD student at University of Bologna, mainly interested in Semantic Web technologies (LOD) applied to GLAM domain.
          </animated.p>
          
          <animated.div style={tagAnimation} className="flex flex-wrap gap-2 justify-start pt-6">
            {tags.map((tag, index) => {
              // Animation for each tag on initial render
              const initialAnimation = useSpring({
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
                delay: 1200 + (index * 100)
              });
              
              // Enhanced hover animation 
              const hoverAnimation = useSpring({
                transform: hoveredTag === tag 
                  ? 'scale(1.15) translateY(-8px) rotate(-2deg)' 
                  : 'scale(1) translateY(0px) rotate(0deg)',
                color: hoveredTag === tag ? 'white' : 'black',
                backgroundColor: hoveredTag === tag ? 'black' : 'transparent',
                boxShadow: hoveredTag === tag 
                  ? '0 15px 25px -4px rgba(0, 0, 0, 0.2), 0 8px 12px -4px rgba(0, 0, 0, 0.15)' 
                  : '0 0 0 rgba(0, 0, 0, 0)',
                letterSpacing: hoveredTag === tag ? '0.05em' : 'normal',
                fontWeight: hoveredTag === tag ? '600' : '500',
                config: { tension: 300, friction: 15 }
              });

              return (
                <animated.span 
                  key={tag}
                  style={{...initialAnimation, ...hoverAnimation}}
                  className="text-lg md:text-xl font-medium px-3.5 py-1.5 rounded border border-black cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  {tag}
                </animated.span>
              );
            })}
          </animated.div>
        </div>
        
        <div className="mt-auto w-full">
          <SimplifiedBookShelf />
        </div>
      </div>

      {/* Desktop layout with overlay */}
      <div className="hidden lg:block h-full w-full">
        {/* Profile info */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-xl z-10 p-6 space-y-3">
          <animated.h2 style={fadeIn} className="text-lg mb-3">
            Hi, I am
          </animated.h2>
          
          <div className="space-y-3 mb-5">
            <animated.h1 style={nameAnimation} className="text-7xl tracking-wider">
              VALENTINA
            </animated.h1>
            <animated.h1 style={nameAnimation} className="text-7xl tracking-wider">
              PASQUAL
            </animated.h1>
          </div>
          
          <animated.h2 style={titleAnimation} className="text-5xl font-semibold tracking-wider text-end mb-6">
            DIGITAL HUMANIST
          </animated.h2>
          
          <animated.p style={paragraphAnimation} className="text-sm text-justify leading-relaxed mb-16">
            PhD student at University of Bologna, mainly interested in Semantic Web technologies (LOD) applied to GLAM domain.
          </animated.p>
          
          <animated.div style={tagAnimation} className="flex flex-wrap gap-2 justify-start pt-8">
            {tags.map((tag, index) => {
              // Animation for each tag on initial render
              const initialAnimation = useSpring({
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
                delay: 1200 + (index * 100)
              });
              
              // Enhanced hover animation
              const hoverAnimation = useSpring({
                transform: hoveredTag === tag 
                  ? 'scale(1.15) translateY(-8px) rotate(-2deg)' 
                  : 'scale(1) translateY(0px) rotate(0deg)',
                color: hoveredTag === tag ? 'white' : 'black',
                backgroundColor: hoveredTag === tag ? 'black' : 'transparent',
                boxShadow: hoveredTag === tag 
                  ? '0 15px 25px -4px rgba(0, 0, 0, 0.2), 0 8px 12px -4px rgba(0, 0, 0, 0.15)' 
                  : '0 0 0 rgba(0, 0, 0, 0)',
                letterSpacing: hoveredTag === tag ? '0.05em' : 'normal',
                fontWeight: hoveredTag === tag ? '600' : '500',
                config: { tension: 300, friction: 15 }
              });

              return (
                <animated.span 
                  key={tag}
                  style={{...initialAnimation, ...hoverAnimation}}
                  className="text-xl font-medium px-3.5 py-1.5 rounded border border-black cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  {tag}
                </animated.span>
              );
            })}
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