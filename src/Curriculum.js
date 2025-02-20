import React, { useEffect, useState } from 'react';

const Curriculum = () => {
  const [employments, setEmployments] = useState([]);
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    const fetchOrcidData = async () => {
      try {
        const orcidId = '0000-0001-5931-5187';
        const apiUrl = `https://pub.orcid.org/v3.0/${orcidId}`;
        const response = await fetch(apiUrl, {
          headers: {
            Accept: 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setEmployments(data['activities-summary']?.employments?.['affiliation-group'] || []);
        setEducations(data['activities-summary']?.educations?.['affiliation-group'] || []);
      } catch (err) {
        console.error('Error fetching ORCID data:', err);
      }
    };

    fetchOrcidData();
  }, []);

  // Date formatting function for the correct nested structure
  const formatDate = (date) => {
    if (!date) return '';
    
    // Check if we have a nested structure with year.value
    if (date.year && date.year.value) {
      const year = date.year.value;
      const month = date.month?.value;
      
      return `${year}${month ? `-${String(month).padStart(2, '0')}` : ''}`;
    }
    
    // Fallback to original format if structure is different
    if (date.year) {
      return `${date.year}${date.month ? `-${String(date.month).padStart(2, '0')}` : ''}`;
    }
    
    return '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="book-2 p-2 rounded-lg shadow-sm mb-4 border-2">
          <h2><span>Employment</span></h2>
        </div>
        <div className="space-y-4 pl-4">
          {employments.map((employment, index) => {
            const summary = employment['summaries'][0]['employment-summary'];
            const startDate = summary['start-date'];
            const endDate = summary['end-date'];
            
            return (
              <div key={index} className="mb-4 border-l-2 border-amber-300 pl-4">
                {/* Make the role title larger and more prominent */}
                {summary['role-title'] && (
                  <h3 className="text-lg font-bold">{summary['role-title']}</h3>
                )}
                <p className="font-medium">{summary['organization']['name']}</p>
                {summary['department-name'] && (
                  <p className="text-sm text-gray-700">{summary['department-name']}</p>
                )}
                <p className="text-sm text-gray-600">
                  {formatDate(startDate)} — {endDate ? formatDate(endDate) : 'Present'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <div className="book-2 p-2 rounded-lg shadow-sm mb-4 border-2">
          <h2><span>Education</span></h2>
        </div>
        <div className="space-y-4 pl-4">
          {educations.map((education, index) => {
            const summary = education['summaries'][0]['education-summary'];
            const startDate = summary['start-date'];
            const endDate = summary['end-date'];
            
            return (
              <div key={index} className="mb-4 border-l-2 border-amber-300 pl-4">
                {/* Make the degree/role title larger and more prominent */}
                {summary['role-title'] && (
                  <h3 className="text-lg font-bold">{summary['role-title']}</h3>
                )}
                <p className="font-medium">{summary['organization']['name']}</p>
                {summary['department-name'] && (
                  <p className="text-sm text-gray-700">{summary['department-name']}</p>
                )}
                <p className="text-sm text-gray-600">
                  {formatDate(startDate)} — {endDate ? formatDate(endDate) : 'Present'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Curriculum;