import React from 'react';

const Contacts = () => {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/ValentinaPasqual', icon: 'bi bi-github' },
    { name: 'Twitter', url: 'https://twitter.com/valepasqual', icon: 'bi bi-twitter' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/valentina-pasqual-96791017b/', icon: 'bi bi-linkedin' },
    { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=EVUFJkAAAAAJ&hl', icon: 'ai ai-google-scholar' },
    { name: 'Figshare', url: 'https://figshare.com/authors/Valentina_Pasqual/10212998', icon: 'ai ai-figshare' },
    { name: 'ORCID', url: 'https://orcid.org/0000-0001-5931-5187', icon: 'ai ai-orcid' },
    { name: 'Wikidata', url: 'https://www.wikidata.org/wiki/Q104099663', icon: 'bi bi-upc' }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {socialLinks.map((link, index) => (
            <li key={index} className="w-full">
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full px-4 pr-20 py-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <div className="flex-shrink-0">
                  <i className={`${link.icon} text-3xl text-gray-700`} aria-hidden="true"></i>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-gray-800">{link.name}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Contacts;