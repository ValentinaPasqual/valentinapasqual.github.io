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
  const [isMobile, setIsMobile] = useState(false);

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
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code" viewBox="0 0 16 16"><path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z"/></svg>
    },
    { 
      id: 2, 
      title: "CURRICULUM", 
      Component: "Projects",
      description: "",
      bookClass: "book-2",
      rotationAngle: 0,
      isSupport: true, // indicates this book supports the first one
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-person" viewBox="0 0 16 16"> <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/> <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2v9.255S12 12 8 12s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h5.5z"/> </svg>
    },
    { 
      id: 3, 
      title: "PUBLICATIONS", 
      Component: "Projects",
      description: "An anthology of modern publishing works examining the intersection of traditional and digital mediums.",
      bookClass: "book-3",
      rotationAngle: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16"> <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/> </svg>
    },
    { 
      id: 4, 
      title: "CONTACTS", 
      Component: "Projects",
      description: "A comprehensive directory of industry professionals and creative practitioners, featuring insights and connections.",
      bookClass: "book-4",
      rotationAngle: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/> </svg>
    }
  ];

  // Calculate book width for positioning
  const bookWidth = 12; // w-12 class equals 3rem or 48px
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
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
    if (!isMobile && selectedBook && containerRef.current) {
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
  }, [selectedBook, books.length, isMobile]);

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
    
    if (isMobile) {
      return '90vw'; // Use 90% of viewport width on mobile
    }
    
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

  // Mobile view with bookmark-style navigation
// Mobile view with enhanced bookmark-style navigation
if (isMobile) {
  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Navigation changes position based on whether a book is open */}
      <div 
        className={`fixed z-30 transition-all duration-500 ease-in-out ${
          selectedBook 
            ? "top-0 left-0 w-full flex justify-center p-2" // Top position when book is open
            : "top-1/2 right-0 -translate-y-1/2 flex flex-col items-end p-2" // Right side when closed
        }`}
      >
        <div className={`${selectedBook ? "flex" : "flex flex-col"}`}>
          {books.map((book) => (
            <div 
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className={`${selectedBook ? "mx-2" : "my-2"} transition-all duration-300 ease-in-out relative group`}
            >
              {/* Bookmark styling with enhanced illustrations */}
              <div 
                className={`
                  ${book.bookClass} 
                  ${selectedBook ? "w-16 h-14" : "w-14 h-20"} 
                  cursor-pointer shadow-md flex flex-col items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${selectedBook === book.id ? "scale-110" : "hover:scale-105"}
                  relative overflow-hidden
                `}
                style={{
                  borderTopRightRadius: selectedBook ? "0.5rem" : "0", 
                  borderBottomRightRadius: selectedBook ? "0.5rem" : "0",
                  borderTopLeftRadius: selectedBook ? "0.5rem" : "0",
                  borderBottomLeftRadius: selectedBook ? "0.5rem" : "0",
                  // Only add a border to the right side when vertical
                  borderRight: !selectedBook ? "2px solid rgba(0,0,0,0.2)" : "none",
                  // Triangle cut at bottom when vertical
                  clipPath: !selectedBook 
                    ? "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0% 80%)" 
                    : "none"
                }}
              >

                {/* Icon with enhanced styling */}
                <div className="flex items-center justify-center text-white z-10">
                  <span className="text-2xl drop-shadow-md">
                  <div className="flex items-center justify-center text-white z-10">
                    <span className="text-2xl drop-shadow-md">{book.icon}</span>
                  </div>
                  </span>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Content Panel for Mobile */}
      {selectedBook && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white flex items-center justify-center p-4 z-20 pt-20">
          <div 
            className={`border-2 border-black rounded-lg shadow-xl overflow-y-auto bg-white w-full max-w-lg max-h-[80vh]
                      transition-all duration-500 ease-in-out`}
          >              
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{books[selectedBook-1].title}</h2>
                
                {/* Mobile Close Button - styled like an enhanced bookmark */}
                <div 
                  onClick={() => setSelectedBook(null)}
                  className="cursor-pointer transition-all duration-300 ease-in-out group"
                >
                  <div className="relative">
                    <div 
                      className={`w-8 h-20 shadow-sm transition-all duration-200 ${books[selectedBook-1].bookClass} border-r-2 hover:scale-105`}
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0% 80%)"
                      }}
                    >
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold drop-shadow-md">
                        ×
                      </div>
                    </div>
                    
                    {/* Close tooltip */}
                    <div 
                      className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap
                                opacity-0 group-hover:opacity-90 pointer-events-none transition-opacity duration-200"
                    >
                      Close
                      {/* Tooltip arrow */}
                      <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 border-l-4 border-l-black border-y-4 border-y-transparent" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="content-container">
                {books[selectedBook-1].title === "PROJECTS" && <Projects />}
                {books[selectedBook-1].title === "PUBLICATIONS" && <Publications />}
                {books[selectedBook-1].title === "CURRICULUM" && <Curriculum />}
                {books[selectedBook-1].title === "CONTACTS" && <Contacts />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  // Desktop view - original bookshelf
  return (
    <div className="h-screen w-screen flex relative overflow-hidden">
      {/* Overlay to hide the left side content when a book is open */}
      {selectedBook && (
        <div className="absolute left-0 top-0 w-screen h-screen z-10"></div>
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