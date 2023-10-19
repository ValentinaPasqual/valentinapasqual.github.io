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
