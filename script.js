const apiKey = 'Xe0NKCnPW6GTU0RfevkHW1cR-Z1nawSx8E5vh_RT57c'; // Unsplash Access Key
const imageContainer = document.getElementById('image-container');
const statusElement = document.getElementById('status');
const searchInput = document.getElementById('search-input'); // Reference to the search input
const searchButton = document.getElementById('search-button'); // Reference to the search button
const maxImages = 1000; // Target max images for the search
const imagesPerPage = 30; // Maximum allowed per request by Unsplash
let totalImagesLoaded = 0;

function clearImages() {
    imageContainer.innerHTML = ''; // Clear existing images
    totalImagesLoaded = 0; // Reset the counter
}

async function fetchCarImages(query) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=${imagesPerPage}`, {
            headers: {
                Authorization: `Client-ID ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok'); // Handle errors
        }

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching images:', error);
        statusElement.textContent = 'Error loading images. Please try again later.';
        return [];
    }
}

async function loadCarImages(query) {
    statusElement.textContent = 'Loading images...';
    
    const photos = await fetchCarImages(query);

    if (photos.length === 0) {
        statusElement.textContent = 'No images found for this query.';
        return;
    }

    photos.forEach(photo => {
        if (totalImagesLoaded < maxImages) {
            const article = document.createElement('figure');
            article.classList.add('article');

            const img = document.createElement('img');
            img.src = photo.urls.regular;
            img.alt = photo.alt_description || 'Car image';

            // Add click event to open the modal with the larger image
            img.addEventListener('click', () => openModal(photo.urls.full));

            const figcaption = document.createElement('figcaption');
            const title = document.createElement('h3');
            title.textContent = ''; // Optional: set a title if available

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

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        clearImages(); // Clear existing images before new search
        await loadCarImages(query);
    }
});

// Event listener for the Enter key in the search input
searchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        const query = searchInput.value.trim();
        if (query) {
            clearImages(); // Clear existing images before new search
            await loadCarImages(query);
        }
    }
});

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

// Load initial images when the page loads (optional)
loadCarImages('bmw'); // Set an initial query
