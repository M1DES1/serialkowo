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

// Elementy DOM
const pages = {
    home: document.getElementById('home-page'),
    episodes: document.getElementById('episodes-page'),
    player: document.getElementById('player-page')
};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    showPage('home');
});

// Inicjalizacja nasłuchiwaczy zdarzeń
function initEventListeners() {
    // Przejście do odcinków po kliknięciu okładki
    const hazbinCover = document.getElementById('hazbin-cover');
    if (hazbinCover) {
        hazbinCover.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('episodes');
        });
    }

    // Przejście do odtwarzacza po kliknięciu odcinka
    document.querySelectorAll('.episode-card').forEach(card => {
        card.addEventListener('click', function() {
            const episodeNumber = parseInt(this.getAttribute('data-episode'));
            playEpisode(episodeNumber);
        });
    });
}

// Pokazywanie odpowiedniej strony
function showPage(pageName) {
    console.log('Przechodzę do strony:', pageName);
    
    // Ukryj wszystkie strony
    Object.values(pages).forEach(page => {
        if (page) {
            page.classList.remove('active');
        }
    });
    
    // Pokaż wybraną stronę
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
    }
    
    // Jeśli przechodzimy do strony głównej, zaktualizuj URL
    if (pageName === 'home') {
        window.history.pushState({}, '', 'index.html');
    }
}

// Powrót do poprzedniej strony
function goBack() {
    const currentPage = getCurrentPage();
    console.log('Powrót z:', currentPage);
    
    if (currentPage === 'episodes') {
        showPage('home');
    } else if (currentPage === 'player') {
        showPage('episodes');
    }
}

// Pobieranie aktualnej strony
function getCurrentPage() {
    for (const [pageName, pageElement] of Object.entries(pages)) {
        if (pageElement && pageElement.classList.contains('active')) {
            return pageName;
        }
    }
    return 'home';
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
        goBack();
    }
});

// Debugowanie - logowanie zmian stron
console.log('Serialkowo zainicjalizowane');