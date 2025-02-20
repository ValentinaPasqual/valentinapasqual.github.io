import React, { useEffect, useState } from 'react';

const Publications = () => {
  const [publicationsByYear, setPublicationsByYear] = useState({});
  
  useEffect(() => {
    const fetchAndParseBib = async () => {
      try {
        const response = await fetch('./data/references.bib').then(res => res.text());
        const entries = parseBibTeX(response);
        
        // Group publications by year
        const grouped = entries.reduce((acc, pub) => {
          const year = pub.year || 'Unknown';
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(pub);
          return acc;
        }, {});
        
        // Sort years in descending order
        const sortedByYear = Object.keys(grouped)
          .sort((a, b) => Number(b) - Number(a))
          .reduce((acc, year) => {
            acc[year] = grouped[year];
            return acc;
          }, {});
          
        setPublicationsByYear(sortedByYear);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    fetchAndParseBib();
  }, []);

  const parseBibTeX = (text) => {
    const entries = [];
    const entryRegex = /@(\w+)\s*{\s*([^,]*),\s*((?:[^{}]*|{[^{}]*})*)\s*}/g;
    const fieldRegex = /(\w+)\s*=\s*{([^}]*)}/g;

    let match;
    while ((match = entryRegex.exec(text)) !== null) {
      const [, type, key, content] = match;
      const entry = { type, key };
      
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(content)) !== null) {
        const [, field, value] = fieldMatch;
        entry[field.toLowerCase()] = value.trim();
      }
      entries.push(entry);
    }

    return entries;
  };

  const getPublicationType = (pub) => {
    if (pub.journal) return "Journal Article";
    if (pub.booktitle) return "Conference Proceedings";
    if (pub.type && pub.type.toLowerCase() === 'techreport') return "Technical Report";
    if (pub.type) return pub.type.charAt(0).toUpperCase() + pub.type.slice(1);
    return "";
  };

  const formatCitation = (pub) => {
    const publicationType = getPublicationType(pub);
    
    const authors = pub.author ? pub.author.split(' and ')
      .map(author => {
        if (author.includes('Pasqual, Valentina') || author.includes('Pasqual, V.')) {
          return `<strong>${author}</strong>`;
        }
        return author;
      })
      .join(', ') : '';
      
    const title = pub.title ? `. ${pub.title}` : '';
    const journal = pub.journal ? `. ${pub.journal}` : '';
    const conference = pub.booktitle ? `. In: ${pub.booktitle}` : '';
    const volume = pub.volume ? `, ${pub.volume}` : '';
    const pages = pub.pages ? `, pp. ${pub.pages}` : '';
    const doi = pub.doi ? `. DOI: ${pub.doi}` : '';

    return (
      <>
        {publicationType && <span className="font-semibold text-gray-600 mr-2">[{publicationType}]</span>}
        <span dangerouslySetInnerHTML={{__html: authors}} /> 
        {title}{journal}{conference}{volume}{pages}{doi}
      </>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {Object.entries(publicationsByYear).map(([year, pubs]) => (
        <div key={year} className="mb-8">
          <div className="book-3 p-2 rounded-lg shadow-sm mb-4 border-2">
            <h2><span>{year}</span></h2>
          </div>
          <div className="space-y-4 pl-4">
            {pubs.map((pub, index) => (
              <div key={index} className="mb-4 border-l-2 border-rose-300 pl-4">
                <p className="text-sm">
                  {formatCitation(pub)}
                </p>
                {pub.doi && (
                  <a 
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-rose-700 hover:underline mt-1 inline-block"
                  >
                    View Publication
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Publications;