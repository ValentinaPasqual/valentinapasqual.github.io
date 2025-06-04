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
        
        setPublicationsByYear(grouped);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    fetchAndParseBib();
  }, []);

const parseBibTeX = (text) => {
  const entries = [];
  
  // Split the text into potential entries by looking for @ symbols at the start of lines
  const lines = text.split('\n');
  let currentEntry = '';
  let inEntry = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('%')) continue;
    
    // Check if this line starts a new entry
    if (line.startsWith('@')) {
      // Process previous entry if it exists
      if (currentEntry) {
        const parsed = parseEntry(currentEntry);
        if (parsed) entries.push(parsed);
      }
      
      // Start new entry
      currentEntry = line;
      inEntry = true;
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
    } else if (inEntry) {
      // Continue building current entry
      currentEntry += '\n' + line;
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      
      // If braces are balanced, entry is complete
      if (braceCount === 0) {
        const parsed = parseEntry(currentEntry);
        if (parsed) entries.push(parsed);
        currentEntry = '';
        inEntry = false;
      }
    }
  }
  
  // Process final entry if it exists
  if (currentEntry) {
    const parsed = parseEntry(currentEntry);
    if (parsed) entries.push(parsed);
  }
  
  return entries;
};

const parseEntry = (entryText) => {
  try {
    // Extract entry type and key
    const firstLine = entryText.split('\n')[0];
    const typeMatch = firstLine.match(/@(\w+)\s*{\s*([^,]*)/);
    if (!typeMatch) return null;
    
    const [, type, key] = typeMatch;
    const entry = { type: type.toLowerCase(), key: key.trim() };
    
    // Extract fields using a more robust approach
    const content = entryText.substring(entryText.indexOf('{') + 1, entryText.lastIndexOf('}'));
    
    // Parse fields more carefully, respecting braces
    const fields = [];
    let currentField = '';
    let braceLevel = 0;
    let inQuotes = false;
    let i = 0;
    
    while (i < content.length) {
      const char = content[i];
      
      if (char === '"' && content[i-1] !== '\\') {
        inQuotes = !inQuotes;
      } else if (!inQuotes) {
        if (char === '{') {
          braceLevel++;
        } else if (char === '}') {
          braceLevel--;
        } else if (char === ',' && braceLevel === 0) {
          // This comma is a field separator
          if (currentField.trim()) {
            fields.push(currentField.trim());
          }
          currentField = '';
          i++;
          continue;
        }
      }
      
      currentField += char;
      i++;
    }
    
    // Don't forget the last field
    if (currentField.trim()) {
      fields.push(currentField.trim());
    }
    
    // Process each field
    for (const field of fields) {
      if (field.includes('=')) {
        const equalIndex = field.indexOf('=');
        const fieldName = field.substring(0, equalIndex).trim();
        const fieldValue = field.substring(equalIndex + 1).trim();
        
        if (fieldName && fieldValue) {
          // Remove outer braces and quotes, but preserve inner content
          let cleanValue = fieldValue;
          
          // Remove outer quotes or braces
          if ((cleanValue.startsWith('{') && cleanValue.endsWith('}')) ||
              (cleanValue.startsWith('"') && cleanValue.endsWith('"'))) {
            cleanValue = cleanValue.slice(1, -1);
          }
          
          entry[fieldName.toLowerCase()] = cleanValue;
        }
      }
    }
    
    return entry;
  } catch (error) {
    console.warn('Failed to parse entry:', entryText.substring(0, 100));
    return null;
  }
};

  const getPublicationType = (pub) => {
    return pub.type || "";
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
      
    const title = pub.title || '';
    const journal = pub.journal ? `. ${pub.journal}` : '';
    const conference = pub.booktitle ? `. In: ${pub.booktitle}` : '';
    const volume = pub.volume ? `, ${pub.volume}` : '';
    const pages = pub.pages ? `, pp. ${pub.pages}` : '';
    const doi = pub.doi ? `. DOI: ${pub.doi}` : '';

    return (
      <>
        {publicationType && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200 mr-3 mb-2">
            {publicationType}
          </span>
        )}
        <div className="leading-relaxed">
          <span dangerouslySetInnerHTML={{__html: authors}} />
          {title && <span className="text-red-600 font-medium italic">. {title}</span>}
          <span className="text-gray-700">{journal}{conference}{volume}{pages}{doi}</span>
        </div>
      </>
    );
  };

  // Sort years at render time to ensure correct order
  const getSortedYearEntries = () => {
    return Object.entries(publicationsByYear).sort(([yearA], [yearB]) => {
      // Handle 'Unknown' year - put it at the end
      if (yearA === 'Unknown') return 1;
      if (yearB === 'Unknown') return -1;
      
      // Sort numeric years in descending order (2025 -> 2019)
      return parseInt(yearB) - parseInt(yearA);
    });
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publications</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"></div>
        </div>
        
        <div className="space-y-10">
          {getSortedYearEntries().map(([year, pubs]) => (
            <div key={year} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  <span className="italic">{year}</span>
                </h2>
              </div>
              
              <div className="px-8 py-6">
                <div className="space-y-8">
                  {pubs.map((pub, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-300 to-pink-300 rounded-full"></div>
                      
                      <div className="pl-8 pr-4">
                        <div className="text-base leading-relaxed text-gray-800">
                          {formatCitation(pub)}
                          {pub.doi && (
                            <div className="mt-3">
                              <a 
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-rose-700 hover:text-rose-900 text-sm font-medium transition-colors duration-200 hover:bg-rose-50 px-3 py-2 rounded-lg"
                                title="View Publication"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Publication
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {Object.keys(publicationsByYear).length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No publications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;