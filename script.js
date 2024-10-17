const apiKey = 'fyLbvlwVC8JAnbug9lfc4C9uAlZPUZep1ksB25XYHtnZj0KQcFLMQ9xb';
const queries = [
    'bmw', 'lamborghini', 'supra', 'mercedes', 'audi', 'porsche', 
    'ferrari', 'tesla', 'mustang', 'chevrolet', 
    'ducati', 'kawasaki', 'suzuki', 'vintage motorcycle'
];
const imageContainer = document.getElementById('image-container');
const statusElement = document.getElementById('status');
const maxImages = 1000;
const imagesPerPage = 80; // Max allowed per request by Pexels
let totalImagesLoaded = 0;

function getRandomQuery() {
    // Select a random query from the list of car brands and models
    const randomIndex = Math.floor(Math.random() * queries.length);
    return queries[randomIndex];
}

function getRandomPageNumber() {
    // Pexels allows you to search through pages of results; set max page limit as per their documentation.
    const maxPages = 100; // Adjust according to your needs or API limits.
    return Math.floor(Math.random() * maxPages) + 1;
}

async function fetchCarImages(query, page) {
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${imagesPerPage}&page=${page}`, {
            headers: {
                Authorization: apiKey
            }
        });
        const data = await response.json();
        return data.photos || [];
    } catch (error) {
        console.error('Error fetching images:', error);
        statusElement.textContent = 'Error loading images. Please try again later.';
        return [];
    }
}

async function loadCarImages() {
    statusElement.textContent = 'Loading images...';

    const totalPages = Math.ceil(maxImages / imagesPerPage);

    // Load images using different queries to ensure variety each time
    for (let i = 0; i < totalPages && totalImagesLoaded < maxImages; i++) {
        const query = getRandomQuery();
        const page = getRandomPageNumber();
        const photos = await fetchCarImages(query, page);

        photos.forEach(photo => {
            if (totalImagesLoaded < maxImages) {
                const article = document.createElement('figure');
                article.classList.add('article');

                const img = document.createElement('img');
                img.src = photo.src.large;
                img.alt = photo.alt;

                const figcaption = document.createElement('figcaption');
                const title = document.createElement('h3');
                title.textContent = 'Car Image';
                
                const description = document.createElement('p');
                description.textContent = `Photo by ${photo.photographer} on Pexels`;

                figcaption.appendChild(title);
                figcaption.appendChild(description);
                article.appendChild(img);
                article.appendChild(figcaption);

                imageContainer.appendChild(article);
                totalImagesLoaded++;
            }
        });

        statusElement.textContent = `Loaded ${totalImagesLoaded} images.`;
    }

    if (totalImagesLoaded >= maxImages) {
        statusElement.textContent = `Loaded ${totalImagesLoaded} images successfully.`;
    } else {
        statusElement.textContent = `Loaded ${totalImagesLoaded} images. Could not load all due to API limits.`;
    }
}

// Load images when the page loads
loadCarImages();

