// Dane serialu
const hazbinHotelData = {
    episodes: [
        {
            number: 1,
            title: "Pilot",
            description: "Odcinek pilotażowy",
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/HAZBIN%20HOTEL%20(PILOT)%20%20Dubbing%20PL%20-%20BruDolina%20Studios%20(1080p,%20h264).mp4"
        }
    ]
};

// Elementy DOM
const pages = {
    home: document.getElementById('home-page'),
    episodes: document.getElementById('episodes-page'),
    player: document.getElementById('player-page')
};

const videoPlayer = document.getElementById('video-player');
const playerOverlay = document.getElementById('player-overlay');
const toggleOverlayBtn = document.getElementById('toggle-overlay');

// Zmienna do śledzenia stanu nakładki
let isOverlayVisible = false;
let currentEpisode = 1;

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    showPage('home');
});

// Inicjalizacja nasłuchiwaczy zdarzeń
function initEventListeners() {
    // Przejście do odcinków po kliknięciu okładki
    document.getElementById('hazbin-cover').addEventListener('click', function() {
        showPage('episodes');
    });

    // Przejście do odtwarzacza po kliknięciu odcinka
    document.querySelectorAll('.episode-card').forEach(card => {
        card.addEventListener('click', function() {
            const episodeNumber = parseInt(this.getAttribute('data-episode'));
            playEpisode(episodeNumber);
        });
    });

    // Przełączanie nakładki odtwarzacza
    toggleOverlayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleOverlay();
    });

    // Zmiana jakości wideo
    document.getElementById('quality-select').addEventListener('change', function() {
        console.log('Zmieniono jakość na:', this.value);
    });

    // Zmiana prędkości odtwarzania
    document.getElementById('speed-select').addEventListener('change', function() {
        videoPlayer.playbackRate = parseFloat(this.value);
        console.log('Zmieniono prędkość na:', this.value + 'x');
    });

    // Zmiana dźwięku
    document.getElementById('audio-select').addEventListener('change', function() {
        console.log('Zmieniono język na:', this.value);
    });

    // Nawigacja między odcinkami
    document.getElementById('prev-episode').addEventListener('click', function(e) {
        e.stopPropagation();
        navigateEpisode(-1);
    });

    document.getElementById('next-episode').addEventListener('click', function(e) {
        e.stopPropagation();
        navigateEpisode(1);
    });

    // Kliknięcie w odcinek w nakładce
    document.querySelectorAll('.episode-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const episodeNumber = parseInt(this.getAttribute('data-episode'));
            playEpisode(episodeNumber);
            hideOverlay();
        });
    });

    // Ukrywanie nakładki po kliknięciu poza nią
    document.addEventListener('click', function(e) {
        if (isOverlayVisible && !e.target.closest('.overlay-content') && e.target !== toggleOverlayBtn) {
            hideOverlay();
        }
    });

    // Event listener dla wideo
    videoPlayer.addEventListener('loadeddata', function() {
        console.log('Wideo załadowane pomyślnie');
    });

    videoPlayer.addEventListener('error', function(e) {
        console.error('Błąd ładowania wideo:', e);
        alert('Błąd ładowania wideo. Sprawdź konsolę dla szczegółów.');
    });

    videoPlayer.addEventListener('canplay', function() {
        console.log('Wideo gotowe do odtwarzania');
    });
}

// Pokazywanie odpowiedniej strony
function showPage(pageName) {
    console.log('Przechodzę do strony:', pageName);
    
    // Ukryj wszystkie strony
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    
    // Pokaż wybraną stronę
    pages[pageName].classList.add('active');
    
    // Ukryj nakładkę przy zmianie strony
    if (pageName !== 'player') {
        hideOverlay();
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
        videoPlayer.pause();
        hideOverlay();
    }
}

// Pobieranie aktualnej strony
function getCurrentPage() {
    for (const [pageName, pageElement] of Object.entries(pages)) {
        if (pageElement.classList.contains('active')) {
            return pageName;
        }
    }
    return 'home';
}

// Odtwarzanie odcinka - POPRAWIONA FUNKCJA
function playEpisode(episodeNumber) {
    console.log('Próba odtworzenia odcinka:', episodeNumber);
    
    const episode = hazbinHotelData.episodes.find(ep => ep.number === episodeNumber);
    
    if (episode) {
        console.log('Znaleziono odcinek:', episode);
        console.log('URL wideo:', episode.videoUrl);
        
        // Pokaż stronę odtwarzacza najpierw
        showPage('player');
        
        // Ustaw źródło wideo
        videoPlayer.src = episode.videoUrl;
        currentEpisode = episodeNumber;
        
        // Zresetuj ustawienia
        document.getElementById('speed-select').value = '1';
        videoPlayer.playbackRate = 1;
        
        // Aktualizacja informacji o odcinku w nakładce
        updateEpisodeInfo(episodeNumber);
        
        // Spróbuj odtworzyć wideo
        const playPromise = videoPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Wideo rozpoczęło odtwarzanie automatycznie');
            }).catch(error => {
                console.log('Automatyczne odtwarzanie zablokowane, wymagane kliknięcie:', error);
                // Dodaj komunikat dla użytkownika
                showPlayMessage();
            });
        }
        
    } else {
        console.error('Nie znaleziono odcinka:', episodeNumber);
        alert('Nie znaleziono odcinka!');
    }
}

// Pokazanie komunikatu o konieczności kliknięcia
function showPlayMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 100;
        border: 2px solid #e50914;
    `;
    message.innerHTML = `
        <h3>Kliknij aby odtworzyć</h3>
        <p>Odtwarzanie wymaga interakcji użytkownika</p>
        <button onclick="this.parentElement.remove(); videoPlayer.play();" 
                style="background: #e50914; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 10px; cursor: pointer;">
            Odtwórz
        </button>
    `;
    
    videoPlayer.parentElement.appendChild(message);
}

// Aktualizacja informacji o odcinku w nakładce
function updateEpisodeInfo(currentEpisodeNumber) {
    const episodeItems = document.querySelectorAll('.episode-item');
    
    episodeItems.forEach(item => {
        item.classList.remove('active');
        const episodeNum = parseInt(item.getAttribute('data-episode'));
        
        if (episodeNum === currentEpisodeNumber) {
            item.classList.add('active');
        }
    });
    
    // Aktualizacja przycisków nawigacji
    const prevBtn = document.getElementById('prev-episode');
    const nextBtn = document.getElementById('next-episode');
    
    prevBtn.disabled = currentEpisodeNumber <= 1;
    nextBtn.disabled = currentEpisodeNumber >= hazbinHotelData.episodes.length;
}

// Nawigacja między odcinkami
function navigateEpisode(direction) {
    const newEpisode = currentEpisode + direction;
    console.log('Nawigacja do odcinka:', newEpisode);
    
    if (newEpisode >= 1 && newEpisode <= hazbinHotelData.episodes.length) {
        playEpisode(newEpisode);
    }
}

// Funkcje do obsługi nakładki
function toggleOverlay() {
    if (isOverlayVisible) {
        hideOverlay();
    } else {
        showOverlay();
    }
}

function showOverlay() {
    playerOverlay.classList.add('active');
    isOverlayVisible = true;
    console.log('Nakładka pokazana');
}

function hideOverlay() {
    playerOverlay.classList.remove('active');
    isOverlayVisible = false;
    console.log('Nakładka ukryta');
}

// Obsługa klawiszy klawiatury
document.addEventListener('keydown', function(event) {
    const currentPage = getCurrentPage();
    
    if (currentPage === 'player') {
        switch(event.key) {
            case ' ':
            case 'k':
                event.preventDefault();
                if (videoPlayer.paused) {
                    videoPlayer.play();
                } else {
                    videoPlayer.pause();
                }
                break;
            case 'f':
                event.preventDefault();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    videoPlayer.requestFullscreen();
                }
                break;
            case 'm':
                event.preventDefault();
                videoPlayer.muted = !videoPlayer.muted;
                break;
            case 'o':
                event.preventDefault();
                toggleOverlay();
                break;
        }
    }
    
    if (event.key === 'Escape') {
        if (isOverlayVisible) {
            hideOverlay();
        } else if (currentPage !== 'home') {
            goBack();
        }
    }
});

// Debugowanie - logowanie zmian stron
console.log('Serialkowo zainicjalizowane');