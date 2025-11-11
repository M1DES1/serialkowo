// Prosty odtwarzacz
const videoPlayer = document.getElementById('video-player');
const videoLoading = document.getElementById('video-loading');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const volumeLevel = document.querySelector('.volume-level');

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    initVideoPlayer();
    initEventListeners();
});

function initVideoPlayer() {
    // Ustaw początkową głośność
    updateVolumeDisplay();
    
    // Pokazuj/ukryj loading
    videoPlayer.addEventListener('loadstart', function() {
        videoLoading.classList.add('show');
    });
    
    videoPlayer.addEventListener('canplay', function() {
        videoLoading.classList.remove('show');
    });
    
    videoPlayer.addEventListener('waiting', function() {
        videoLoading.classList.add('show');
    });
    
    videoPlayer.addEventListener('playing', function() {
        videoLoading.classList.remove('show');
    });
    
    videoPlayer.addEventListener('error', function(e) {
        videoLoading.classList.remove('show');
        console.error('Błąd wideo:', e);
        alert('Błąd ładowania wideo. Spróbuj odświeżyć stronę.');
    });
}

function initEventListeners() {
    // Aktualizuj pasek głośności
    volumeSlider.addEventListener('input', function() {
        updateVolumeDisplay();
    });
    
    // Klawisze klawiatury
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case ' ':
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
            case 'ArrowLeft':
                event.preventDefault();
                skipTime(-10);
                break;
            case 'ArrowRight':
                event.preventDefault();
                skipTime(10);
                break;
        }
    });
}

function changeEpisode(episodeNumber) {
    if (episodeNumber === 1) {
        // Resetuj do początku
        videoPlayer.currentTime = 0;
        videoPlayer.play();
    }
    // Tutaj możesz dodać ładowanie innych odcinków
}

function changeSpeed(speed) {
    videoPlayer.playbackRate = parseFloat(speed);
    console.log('Prędkość zmieniona na:', speed + 'x');
}

function changeVolume(value) {
    const volume = value / 100;
    videoPlayer.volume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    const value = volumeSlider.value;
    const volume = value / 100;
    volumeLevel.style.width = value + '%';
    volumeValue.textContent = value + '%';
    
    // Zmiana koloru przy niskiej głośności
    if (value < 30) {
        volumeLevel.style.background = 'linear-gradient(90deg, #ff6b6b, #ff4757)';
    } else if (value < 70) {
        volumeLevel.style.background = 'linear-gradient(90deg, #e50914, #ff6b6b)';
    } else {
        volumeLevel.style.background = 'linear-gradient(90deg, #e50914, #ff4757)';
    }
}

function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    if (videoPlayer.muted) {
        volumeLevel.style.background = '#666';
    } else {
        updateVolumeDisplay();
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

function skipTime(seconds) {
    videoPlayer.currentTime += seconds;
}

function playNextEpisode() {
    alert('Kolejny odcinek będzie dostępny wkrótce!');
}

// Automatyczne pełny ekran dla lepszego doświadczenia
videoPlayer.addEventListener('dblclick', function() {
    toggleFullscreen();
});

// Aktualizacja progress bar dla odcinków
videoPlayer.addEventListener('timeupdate', function() {
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    const progressFill = document.querySelector('.episode-card.active .progress-fill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
});
