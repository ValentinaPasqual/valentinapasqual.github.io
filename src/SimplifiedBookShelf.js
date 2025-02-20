import React, { useState, useRef, useEffect } from 'react';
import Projects from './Projects';
import Publications from './Publications';
import Curriculum from './Curriculum';
import Contacts from './Contacts';


const RealisticBookShelf = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [firstBookRotated, setFirstBookRotated] = useState(true);
  const [isEarringHovered, setIsEarringHovered] = useState(false);
  const containerRef = useRef(null);
  const [leftOffset, setLeftOffset] = useState(0);
  const [bookPositions, setBookPositions] = useState([]);

  const books = [
    { 
      id: 1, 
      title: "PROJECTS", 
      Component: "Projects",
      description: "",
      bookClass: "book-1",
      rotationAngle: 12,
      horizontalShift: -1, // shift to the left to precisely touch the second book
      contactPoint: { x: 12, y: '40%' }, // where the book touches the second book
    },
    { 
      id: 2, 
      title: "CURRICULUM", 
      Component: "Projects",
      description: "",
      bookClass: "book-2",
      rotationAngle: 0,
      isSupport: true, // indicates this book supports the first one
    },
    { 
      id: 3, 
      title: "PUBLICATIONS", 
      Component: "Projects",
      description: "An anthology of modern publishing works examining the intersection of traditional and digital mediums.",
      bookClass: "book-3",
      rotationAngle: 0
    },
    { 
      id: 4, 
      title: "CONTACTS", 
      Component: "Projects",
      description: "A comprehensive directory of industry professionals and creative practitioners, featuring insights and connections.",
      bookClass: "book-4",
      rotationAngle: 0
    }
  ];

  // Calculate book width for positioning
  const bookWidth = 12; // w-12 class equals 3rem or 48px
  
  // Control first book rotation and positioning based on any book being selected
  useEffect(() => {
    if (selectedBook) {
      setFirstBookRotated(false);
      setBookPositions([]);
    } else {
      setTimeout(() => {
        setFirstBookRotated(true);
        
        // Calculate exact contact position using trigonometry
        // When book 1 rotates by X degrees, we need to calculate where it intersects book 2
        const book1 = books[0];
        const rotationRadians = (book1.rotationAngle * Math.PI) / 180;
        
        // Calculate how much space the rotated book needs horizontally
        // sin(rotation) * height determines horizontal shift needed
        const bookHeight = 96; // Approximate book height in viewport height units (96vh)
        const rotatedWidth = Math.sin(rotationRadians) * bookHeight;
        
        // Calculate positions for books to create leaning effect
        const newPositions = books.map((book, index) => {
          if (index === 0) {
            // First book leans precisely against the second book
            return {
              rotationAngle: book.rotationAngle,
              horizontalShift: book.horizontalShift || 0,
              verticalShift: 0,
              width: bookWidth,
              height: bookHeight,
              contactPoint: true
            };
          }
          // Other books remain upright with fixed positions
          return {
            rotationAngle: 0,
            horizontalShift: index === 1 ? 0 : 0, // No horizontal shift for second book
            verticalShift: 0,
            contactPoint: index === 1 // Second book is contact point
          };
        });
        
        // Only update if positions actually changed to prevent infinite loop
        if (JSON.stringify(newPositions) !== JSON.stringify(bookPositions)) {
          setBookPositions(newPositions);
        }
      }, 300);
    }
  }, [selectedBook, books.length]); // Changed dependency to books.length instead of books object

  // Calculate offset to ensure NO books overflow to the left of viewport
  useEffect(() => {
    if (selectedBook && containerRef.current) {
      const windowWidth = window.innerWidth;
      const bookWidth = 12; // w-12 class (3rem/48px)
      const spacing = 6; // Space between books
      const bookSpineWidthWithSpacing = bookWidth + spacing;
      const openBookWidth = Math.min(windowWidth * 0.65, windowWidth - 100); // Open book panel width
      
      // Calculate width needed for all books
      // First book position is the key - it must never be less than 0 (left edge of viewport)
      const selectedBookPosition = (selectedBook - 1) * bookSpineWidthWithSpacing;
      
      // For the last book special case, we need to ensure it has enough space on the right
      if (selectedBook === books.length) {
        // Calculate available width after accounting for content
        const availableWidth = windowWidth - openBookWidth - 20; // extra 20px safety margin
        
        // Calculate how far to shift right to ensure content fits
        // But we can't go below 0, which would push books off left viewport
        const minOffset = Math.max(0, selectedBookPosition - availableWidth);
        
        setLeftOffset(minOffset);
      } else {
        // For all other books, simply ensure they don't overflow left
        // Book offset must be at least the position of the first book
        const minOffset = Math.max(0, selectedBookPosition);
        
        setLeftOffset(minOffset);
      }
    } else {
      setLeftOffset(0);
    }
  }, [selectedBook, books.length]);

  const handleBookClick = (bookId) => {
    if (selectedBook === bookId) {
      setSelectedBook(null);
    } else {
      setSelectedBook(bookId);
    }
  };

  // Function to determine the correct z-index for each book
  const getBookZIndex = (bookId, index) => {
    if (selectedBook === bookId) {
      return 30; // Selected book always on top
    }
    
    if (selectedBook) {
      return 20 - index; // Normal stacking when a book is selected
    }
    
    // Special handling for the leaning book effect
    if (firstBookRotated) {
      if (bookId === 1) {
        return 19; // First book behind second book
      }
      if (bookId === 2) {
        return 20; // Second book in front of first
      }
    }
    
    return 20 - index; // Default stacking order
  };

  // Calculate book content width with guaranteed fit within viewport
  const getBookContentWidth = (bookId) => {
    if (selectedBook !== bookId) return 0;
    
    const windowWidth = window.innerWidth;
    const bookPosition = (selectedBook - 1) * 18; // Book position (width + spacing)
    
    // Calculate maximum available width to fit content
    // For the last book, we need to ensure it doesn't overflow right side
    if (bookId === books.length) {
      const maxContentWidth = windowWidth - bookPosition - 48; // 48px safe margin
      const percentWidth = Math.min(windowWidth * 0.65, maxContentWidth);
      return `${percentWidth}px`;
    } 
    
    // For other books, calculate available width based on position
    const maxContentWidth = windowWidth - bookPosition - 24;
    const targetWidth = Math.min(windowWidth * 0.65, maxContentWidth);
    return `${targetWidth}px`;
  };

  // Add a resize listener to ensure responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      // Force recalculation of offsets when window is resized
      if (selectedBook) {
        // Slight delay to ensure DOM updates
        setTimeout(() => {
          const event = new Event('resize');
          window.dispatchEvent(event);
        }, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedBook]);

  return (
    <div className="h-screen w-screen flex relative overflow-hidden">
      {/* Overlay to hide the left side content when a book is open */}
      {selectedBook && (
        <div className="absolute left-0 top-0 w-screen h-screen bg-[#EBE9CC] z-10"></div>
      )}
      
      <div className="h-screen w-full flex items-end justify-end pr-0 transition-all duration-500 ease-in-out relative">
        {/* Container for all books with calculated positioning to prevent left overflow */}
        <div 
          ref={containerRef}
          className="h-[96vh] my-2 flex transition-all duration-500 ease-in-out relative z-20 pl-2"
          style={{
            transform: selectedBook ? `translateX(${leftOffset}px)` : 'translateX(0)',
            minWidth: 'fit-content', // Ensure container doesn't shrink too much
          }}
        >
          {books.map((book, index) => (
            <div
              key={book.id}
              style={{ 
                zIndex: getBookZIndex(book.id, index),
                position: 'relative',
                // Only apply positioning to the first book
                ...(bookPositions[index] && !selectedBook && index === 0 ? {
                  transform: `translateX(${bookPositions[index].horizontalShift || 0}px)`,
                } : {}),
                // Add margins to first book only when it's rotated
                ...(book.id === 1 && firstBookRotated && !selectedBook ? { 
                  marginRight: '8rem',
                  marginBottom: '1rem'
                } : {})
              }}
              className={`flex transition-all duration-500 ease-in-out ${
                !firstBookRotated && book.id > 1 ? 'ml-2' : ''
              }`}
            >
              {/* Shadow element for each book */}
              <div 
                className="absolute"
                style={{
                  bottom: '1px',
                  right: '-3px', 
                  width: '14px',
                  height: '99%',
                  backgroundColor: 'rgba(0,0,0)',
                  borderRadius: '0 0 2px 0',
                  transition: 'all 300ms ease-in-out',
                  transform: book.id === 1 && firstBookRotated && !selectedBook 
                  ? `translateX(${book.horizontalShift || 0}px) translateY(${book.verticalShift || 15}px) rotate(${book.rotationAngle}deg)` 
                  : 'rotate(0deg)',
                  transformOrigin: book.id === 1 ? 'bottom left' : 'bottom center',
                  pointerEvents: 'none',
                  zIndex: -1
                }}
              />
              
              {/* Book spine with realistic rotation and leaning effect */}
              <div
                onClick={() => handleBookClick(book.id)}
                className={`${book.bookClass} book cursor-pointer flex flex-col items-center justify-center 
                          transition-all duration-300 ease-in-out
                          w-12 origin-bottom relative`}
                style={{
                  // Calculate precise positioning for book 1
                  transform: book.id === 1 && firstBookRotated && !selectedBook 
                    ? `translateX(${book.horizontalShift || 0}px) rotate(${book.rotationAngle}deg)` 
                    : book.id === 2 && firstBookRotated && !selectedBook
                    ? 'translateX(0) rotate(0deg)' // Ensure book 2 is exactly positioned
                    : 'rotate(0deg)',
                  transformOrigin: book.id === 1 ? 'bottom left' : 'bottom center',
                  perspective: '800px',
                  perspectiveOrigin: 'left center',
                  // Enhance contact point with precise shadow
                  boxShadow: book.id === 2 && firstBookRotated && !selectedBook 
                    ? '-1px 0px 2px rgba(0,0,0,0.15)' 
                    : 'none',
                  // Add margin to create proper spacing between books
                  marginLeft: book.id > 1 ? '6px' : '0', // Increased spacing between books
                  // Remove the z-index here as we're handling it in the parent div
                }}
              > 
                <span 
                  className="transform whitespace-nowrap text-lg tracking-wide transition-transform duration-300 ease-in-out -rotate-90"
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center center',
                    display: 'inline-block'
                  }}
                >
                  {book.title}
                </span>
                
                {/* Book description - horizontal text 
                <div className="absolute bottom-0 left-0 right-0">
                  <p className="text-[12px] text-left opacity-50  px-1">
                    {book.description}
                  </p>
                </div>*/}
              </div>
              
              {/* Open book content panel - with improved positioning */}
              <div 
                className={`border-2 border-black overflow-hidden overflow-y-auto transition-all duration-500 ease-in-out bg-white
                          shadow-2xl rounded-l-lg relative
                          ${selectedBook === book.id ? 'opacity-100' : 'opacity-0'}`}
                          
                style={{
                  width: getBookContentWidth(book.id),
                }}
              >
                {/* Minimal bookmark with X */}
                {selectedBook === book.id && (
                  <div 
                    className="absolute top-0 right-8 z-50 cursor-pointer transition-all duration-300 ease-in-out"
                    onMouseEnter={() => setIsEarringHovered(true)}
                    onMouseLeave={() => setIsEarringHovered(false)}
                    onClick={() => handleBookClick(book.id)}
                    style={{
                      transform: isEarringHovered ? 'translateY(2px)' : 'translateY(0)',
                    }}
                  >
                    <div className="relative">
                      {/* Taller bookmark tab using book colors */}
                      <div 
                        className={`w-8 h-24 shadow-sm transition-all duration-200 ${
                          book.bookClass === 'book-1' ? 'book-1 border-r-2' :
                          book.bookClass === 'book-2' ? 'book-2 border-r-2' :
                          book.bookClass === 'book-3' ? 'book-3 border-r-2' : 'book-4 border-r-2'
                        }`}
                      >
                        {/* X mark */}
                        <div 
                          className={`absolute top-3 left-1/2 transform -translate-x-1/2
                                    transition-all duration-200 text-white text-lg font-bold
                                    ${isEarringHovered ? 'scale-110' : 'scale-100'}`}
                        >
                          ×
                        </div>
                      </div>
                    </div>
                  </div>
                )}
  
                <div className="p-4 md:p-6 h-full">
                  
                  <div className="content-container pr-20">
                    {book.title === "PROJECTS" && <Projects />}
                    {book.title === "PUBLICATIONS" && <Publications />}
                    {book.title === "CURRICULUM" && <Curriculum />}
                    {book.title === "CONTACTS" && <Contacts />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealisticBookShelf;