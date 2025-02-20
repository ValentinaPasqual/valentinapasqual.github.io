import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projectCategories, setProjectCategories] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('./data/projects.json')
      .then(response => response.json())
      .then(data => setProjectCategories(data))
      .catch(error => setError(error.message));
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {Object.entries(projectCategories).map(([category, projects]) => (
        <div key={category} className="mb-8">
          <div className="book-1 p-2 rounded-lg shadow-sm mb-4 border-2">
            <h2><span>{category}</span></h2>
          </div>
          
          <div className="space-y-6 pl-4">
            {Object.entries(projects).map(([projectName, details]) => (
              <div key={projectName} className="mb-6 border-l-2 border-gray-300 pl-4">
                <h3 className="text-xl font-semibold book-1-accent">{projectName}</h3>
                
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {details.type?.map((type, typeIndex) => (
                    <span key={typeIndex} className="text-sm text-gray-600 border-b border-gray-300">
                      {type}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm text-gray-700 mb-2">
                  {details.description || "No description available"}
                </p>
                
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Year:</span> {details.year} | 
                  <span className="font-medium"> Authors:</span> {details.authors}
                </p>
                
                {details.link && (
                  <a 
                    href={details.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm book-1-accent hover:underline mt-2 inline-block"
                  >
                    View Project
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

export default Projects;