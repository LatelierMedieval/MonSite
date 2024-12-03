// Sélection des éléments nécessaires
const thumbnails = document.querySelectorAll('.thumbnail');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const body = document.body;

// Tableau des images
let images = [];
thumbnails.forEach(thumbnail => {
    images.push(thumbnail.href);
});

// Index de l'image active
let currentIndex = 0;

// Fonction pour ouvrir la lightbox
function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = images[currentIndex];
    lightbox.style.display = 'block';
    body.classList.add('lightbox-open'); // Ajoute la classe pour désactiver les événements du header
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    body.classList.remove('lightbox-open'); // Retire la classe pour réactiver les événements du header
}

// Fonction pour afficher l'image précédente
function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
}

// Fonction pour afficher l'image suivante
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex];
}

// Événements pour ouvrir la lightbox au clic sur une vignette
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
    });
});

// Événement pour fermer la lightbox
closeBtn.addEventListener('click', closeLightbox);

// Événements pour naviguer entre les images
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// Fermer la lightbox en cliquant à l'extérieur de l'image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Gestion de la navigation au clavier
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});
