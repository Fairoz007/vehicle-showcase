const apiKey = 'Xe0NKCnPW6GTU0RfevkHW1cR-Z1nawSx8E5vh_RT57c'; // Unsplash Access Key
const queries = [
    'bmw', 'lamborghini', 'supra', 'mercedes', 'audi', 'porsche', 
    'ferrari', 'tesla', 'mustang', 'chevrolet', 

];
const imageContainer = document.getElementById('image-container');
const statusElement = document.getElementById('status');
const maxImages = 100; // Target 100 images for the initial load
const imagesPerPage = 30; // Maximum allowed per request by Unsplash
let totalImagesLoaded = 0;

function getRandomQuery() {
    const randomIndex = Math.floor(Math.random() * queries.length);
    return queries[randomIndex];
}

async function fetchCarImages(query) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=${imagesPerPage}`, {
            headers: {
                Authorization: `Client-ID ${apiKey}`
            }
        });
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching images:', error);
        statusElement.textContent = 'Error loading images. Please try again later.';
        return [];
    }
}

async function loadCarImages() {
    statusElement.textContent = 'Loading images...';

    while (totalImagesLoaded < maxImages) {
        const query = getRandomQuery();
        const photos = await fetchCarImages(query);

        photos.forEach(photo => {
            if (totalImagesLoaded < maxImages) {
                const article = document.createElement('figure');
                article.classList.add('article');

                const img = document.createElement('img');
                img.src = photo.urls.regular;
                img.alt = photo.alt_description || 'Car or motorcycle image';

                // Add click event to open the modal with the larger image
                img.addEventListener('click', () => openModal(photo.urls.full));

                const figcaption = document.createElement('figcaption');
                const title = document.createElement('h3');
                title.textContent = '';

                const description = document.createElement('p');
                description.textContent = `Photo by ${photo.user.name} on Unsplash`;

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

// Modal Elements for image preview
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

// Load images when the page loads
loadCarImages();
