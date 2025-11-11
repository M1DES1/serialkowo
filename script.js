// Dane serialu
const hazbinHotelData = {
    episodes: [
        {
            number: 1,
            title: "Pilot",
            description: "Odcinek pilotażowy",
            videoUrl: "seriale/hazbinhotel/HAZBIN%20HOTEL%20(PILOT)%20%20Dubbing%20PL%20-%20BruDolina%20Studios%20(1080p,%20h264).mp4"
        }
    ]
};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona załadowana');
    initEventListeners();
});

// Inicjalizacja nasłuchiwaczy zdarzeń
function initEventListeners() {
    // Przejście do odcinków po kliknięciu okładki
    const hazbinCover = document.getElementById('hazbin-cover');
    if (hazbinCover) {
        console.log('Znaleziono okładkę Hazbin Hotel');
        hazbinCover.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Kliknięto okładkę Hazbin Hotel');
            window.location.href = 'hazbin-hotel.html';
        });
    }

    // Przejście do odtwarzacza po kliknięciu odcinka
    const episodeCards = document.querySelectorAll('.episode-card');
    if (episodeCards.length > 0) {
        console.log('Znaleziono karty odcinków:', episodeCards.length);
        episodeCards.forEach(card => {
            card.addEventListener('click', function() {
                const episodeNumber = parseInt(this.getAttribute('data-episode'));
                console.log('Kliknięto odcinek:', episodeNumber);
                playEpisode(episodeNumber);
            });
        });
    }
}

// Odtwarzanie odcinka
function playEpisode(episodeNumber) {
    console.log('Próba odtworzenia odcinka:', episodeNumber);
    
    const episode = hazbinHotelData.episodes.find(ep => ep.number === episodeNumber);
    
    if (episode) {
        console.log('Znaleziono odcinek:', episode);
        
        // Przekierowanie do odtwarzacza z numerem odcinka
        window.location.href = `player.html?episode=${episodeNumber}`;
        
    } else {
        console.error('Nie znaleziono odcinka:', episodeNumber);
        alert('Nie znaleziono odcinka!');
    }
}

// Obsługa klawiszy klawiatury
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Powrót do poprzedniej strony
        if (document.referrer) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }
});

console.log('Serialkowo zainicjalizowane');