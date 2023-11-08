// TEMPLATE FOR PROJECTS

// Function to fetch JSON data
function fetchJSONData(callback) {
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching JSON data: ', error));
}

// Function to render the template
function renderTemplate(data) {
    const contentContainer = document.getElementById('content-container');

    // Convert the object into an array of objects
    const dataArray = Object.keys(data).map(key => ({
        [key]: data[key]
    }));

    dataArray.forEach(item => {
        const itemName = Object.keys(item)[0];
        const itemData = item[itemName];

        // Render the "type" array as badges
        const typeBadges = itemData.type.map(type => `<span class="badge bg-primary">${type}</span>`).join(' ');

        const cardHTML = `
            <div class="col-md-6 projects-cards">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${itemName}</h5>
                        <div class="card-text">${typeBadges}</div>
                        <p class="card-text">${itemData.description}</p>
                        <p class="card-text">Year: ${itemData.year}</p>
                        <p class="card-text">Authors: ${itemData.authors}</p>
                        <a href="${itemData.link}" class="btn btn-primary">Learn More</a>
                    </div>
                </div>
            </div>
        `;

        contentContainer.innerHTML += cardHTML;
    });
}

// Fetch JSON data and render the template
fetchJSONData(renderTemplate);



// FETCH SCHOLAR API - wORK IN PROGRESS
const apiUrl = 'https://api.semanticscholar.org/graph/v1/author/1389971682?fields=papers.authors,papers.title,papers.url,papers.year,papers.venue,papers.publicationTypes';
const pubsContainer = document.getElementById('publications');

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Display data in an HTML element

    data.papers.forEach(paper => {
      const newElement = document.createElement('p');
      const paperTitle = paper.title;
      pubsContainer.appendChild(paperTitle);
    })
  })
  .catch(error => {
    console.error('Error:', error);
  });
