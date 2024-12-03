// Récupérer tous les éléments avec la classe thumbnail
var thumbnails = document.querySelectorAll('.thumbnail');

// Ajouter un écouteur d'événement à chaque miniature
thumbnails.forEach(function(thumbnail) {
    thumbnail.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le lien de s'ouvrir
        var imageUrl = this.getAttribute('href');
        var lightboxContent = document.querySelector('.lightbox-content');
        lightboxContent.setAttribute('src', imageUrl);
        // Afficher la lightbox
        document.querySelector('.lightbox').style.display = 'flex';
        document.addEventListener('keydown', handleKeyPress);
        currentImageIndex = Array.from(thumbnails).findIndex(thumbnail => thumbnail.getAttribute('href') === imageUrl);  // Mettre à jour l'index de l'image actuelle
    });
});

// Récupérer l'élément avec la classe close
var closeButton = document.querySelector('.close');

// Ajouter un écouteur d'événement au bouton de fermeture
closeButton.addEventListener('click', function() {
    // Masquer la lightbox
    document.querySelector('.lightbox').style.display = 'none';
    document.removeEventListener('keydown', handleKeyPress);
});

// Ajouter un écouteur d'événement pour les flèches gauche et droite
var prevButton = document.querySelector('.prev');
var nextButton = document.querySelector('.next');

// Fonction pour afficher l'image précédente
prevButton.addEventListener('click', function() {
    if (currentImageIndex > 0) {
        thumbnails[currentImageIndex - 1].click();
    }
});

// Fonction pour afficher l'image suivante
nextButton.addEventListener('click', function() {
    if (currentImageIndex < thumbnails.length - 1) {
        thumbnails[currentImageIndex + 1].click();
    }
});

// Gérer les événements clavier pour le défilement des images
function handleKeyPress(event) {
    var lightboxContent = document.querySelector('.lightbox-content');
    var currentImageIndex = Array.from(thumbnails).findIndex(thumbnail => thumbnail.getAttribute('href') === lightboxContent.getAttribute('src'));

    switch (event.key) {
        case 'ArrowLeft':
            if (currentImageIndex > 0) {
                thumbnails[currentImageIndex - 1].click();
            }
            break;
        case 'ArrowRight':
            if (currentImageIndex < thumbnails.length - 1) {
                thumbnails[currentImageIndex + 1].click();
            }
            break;
        case 'Escape':
            closeButton.click();
            break;
        default:
            break;
    }
}
