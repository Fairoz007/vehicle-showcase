const apiKey = 'fyLbvlwVC8JAnbug9lfc4C9uAlZPUZep1ksB25XYHtnZj0KQcFLMQ9xb';
const queries = [
    'bmw', 'lamborghini', 'supra', 'mercedes', 'audi', 'porsche', 
    'ferrari', 'tesla', 'mustang', 'chevrolet', 
    'ducati', 'kawasaki', 'suzuki', 'vintage motorcycle'
];
const imageContainer = document.getElementById('image-container');
const statusElement = document.getElementById('status');
const maxImages = 1000;
const imagesPerPage = 80;
let totalImagesLoaded = 0;

// Modal Elements
const modal = document.createElement('div');
modal.classList.add('modal');
document.body.appendChild(modal);

const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');
modal.appendChild(modalContent);

const modalImage = document.createElement('img');
modalContent.appendChild(modalImage);

const closeModalButton = document.createElement('button');
closeModalButton.classList.add('modal-close');
closeModalButton.innerHTML = '&times;';
modal.appendChild(closeModalButton);

function openModal(imageSrc) {
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function getRandomQuery() {
    const randomIndex = Math.floor(Math.random() * queries.length);
    return queries[randomIndex];
}

function getRandomPageNumber() {
    const maxPages = 100;
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

                // Add click event to open the modal with the larger image
                img.addEventListener('click', () => openModal(photo.src.large));

                const figcaption = document.createElement('figcaption');
                const title = document.createElement('h3');
                title.textContent = 'Image';

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
