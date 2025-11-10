// Dane serialu
const hazbinHotelData = {
    episodes: [
        {
            number: 1,
            title: "Pilot",
            duration: "32 min",
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/HAZBIN%20HOTEL%20(PILOT)%20%20Dubbing%20PL%20-%20BruDolina%20Studios%20(1080p,%20h264).mp4"
        }
    ]
};

// Elementy DOM
const videoPlayer = document.getElementById('video-player');
const playerOverlay = document.getElementById('player-overlay');
const loadingSpinner = document.getElementById('loading-spinner');
const playerTitle = document.getElementById('player-title');

// Zmienne
let currentEpisode = 1;
let isOverlayVisible = false;

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    // Pobierz numer odcinka z URL
    const urlParams = new URLSearchParams(window.location.search);
    const episodeParam = urlParams.get('episode');
    
    if (episodeParam) {
        currentEpisode = parseInt(episodeParam);
    }
    
    loadEpisode(currentEpisode);
    initEventListeners();
});

function initEventListeners() {
    // Ukrywanie nakładki po kliknięciu poza nią
    document.addEventListener('click', function(e) {
        if (isOverlayVisible && !e.target.closest('.overlay-content') && e.target !== toggleOverlayBtn) {
            hideOverlay();
        }
    });
    
    // Klawisze klawiatury
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case ' ':
            case 'k':
                event.preventDefault();
                togglePlayPause();
                break;
            case 'f':
                event.preventDefault();
                toggleFullscreen();
                break;
            case 'm':
                event.preventDefault();
                toggleMute();
                break;
            case 'o':
            case 'O':
                event.preventDefault();
                toggleOverlay();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                skipTime(-10);
                break;
            case 'ArrowRight':
                event.preventDefault();
                skipTime(10);
                break;
            case 'Escape':
                if (isOverlayVisible) {
                    hideOverlay();
                }
                break;
        }
    });
    
    // Event listeners dla wideo
    videoPlayer.addEventListener('loadstart', function() {
        showLoading();
    });
    
    videoPlayer.addEventListener('canplay', function() {
        hideLoading();
    });
    
    videoPlayer.addEventListener('waiting', function() {
        showLoading();
    });
    
    videoPlayer.addEventListener('playing', function() {
        hideLoading();
    });
    
    videoPlayer.addEventListener('error', function(e) {
        hideLoading();
        console.error('Błąd wideo:', e);
        alert('Błąd ładowania wideo. Spróbuj odświeżyć stronę.');
    });
}

function loadEpisode(episodeNumber) {
    const episode = hazbinHotelData.episodes.find(ep => ep.number === episodeNumber);
    
    if (episode) {
        console.log('Ładowanie odcinka:', episodeNumber);
        showLoading();
        
        // Ustaw źródło wideo
        videoPlayer.src = episode.videoUrl;
        currentEpisode = episodeNumber;
        
        // Aktualizacja interfejsu
        updateEpisodeInfo(episodeNumber);
        updatePlayerTitle(episode.title);
        
        // Spróbuj odtworzyć (bez autoplay - użytkownik musi kliknąć)
        videoPlayer.load();
        
    } else {
        console.error('Nie znaleziono odcinka:', episodeNumber);
        alert('Nie znaleziono odcinka!');
    }
}

function updateEpisodeInfo(episodeNumber) {
    // Aktualizacja listy odcinków
    document.querySelectorAll('.episode-item').forEach(item => {
        item.classList.remove('active');
        const itemEpisode = parseInt(item.getAttribute('data-episode'));
        
        if (itemEpisode === episodeNumber) {
            item.classList.add('active');
        }
    });
    
    // Aktualizacja przycisków nawigacji
    const prevBtn = document.getElementById('prev-episode');
    const nextBtn = document.getElementById('next-episode');
    
    prevBtn.disabled = episodeNumber <= 1;
    nextBtn.disabled = episodeNumber >= hazbinHotelData.episodes.length;
}

function updatePlayerTitle(episodeTitle) {
    playerTitle.textContent = `Hazbin Hotel - ${episodeTitle}`;
}

// Funkcje nakładki
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
}

function hideOverlay() {
    playerOverlay.classList.remove('active');
    isOverlayVisible = false;
}

// Nawigacja między odcinkami
function navigateEpisode(direction) {
    const newEpisode = currentEpisode + direction;
    
    if (newEpisode >= 1 && newEpisode <= hazbinHotelData.episodes.length) {
        loadEpisode(newEpisode);
        hideOverlay();
    }
}

function changeEpisode(episodeNumber) {
    loadEpisode(episodeNumber);
    hideOverlay();
}

// Kontrolki wideo
function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

function changePlaybackRate(speed) {
    videoPlayer.playbackRate = speed;
    
    // Wizualna informacja o zmianie prędkości
    const speedDisplay = document.createElement('div');
    speedDisplay.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(229, 9, 20, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 100;
    `;
    speedDisplay.textContent = speed + 'x';
    
    videoPlayer.parentElement.appendChild(speedDisplay);
    
    setTimeout(() => {
        speedDisplay.remove();
    }, 1000);
    
    console.log('Prędkość odtwarzania:', speed + 'x');
}

function skipTime(seconds) {
    videoPlayer.currentTime += seconds;
    
    // Wizualna informacja o przewijaniu
    const skipDisplay = document.createElement('div');
    skipDisplay.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(229, 9, 20, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 100;
    `;
    skipDisplay.textContent = (seconds > 0 ? '+' : '') + seconds + 's';
    
    videoPlayer.parentElement.appendChild(skipDisplay);
    
    setTimeout(() => {
        skipDisplay.remove();
    }, 800);
}

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    
    // Aktualizuj ikonę przycisku
    const muteBtn = document.querySelector('[onclick="toggleMute()"] .icon');
    if (muteBtn) {
        muteBtn.textContent = videoPlayer.muted ? '🔇' : '🔊';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen().catch(err => {
            console.log('Błąd pełnego ekranu:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Loading functions
function showLoading() {
    loadingSpinner.classList.add('show');
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
}

// Preload wideo dla lepszego doświadczenia
function preloadVideo(url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = url;
    document.head.appendChild(link);
}

// Preload pierwszego odcinka
preloadVideo(hazbinHotelData.episodes[0].videoUrl);