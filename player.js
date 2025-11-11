// Prosty odtwarzacz
const videoPlayer = document.getElementById('video-player');
const videoLoading = document.getElementById('video-loading');
const videoInfo = document.getElementById('video-info');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const volumeLevel = document.querySelector('.volume-level');

// Link do wideo
const videoUrl = "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/HAZBIN%20HOTEL%20(PILOT)%20%20Dubbing%20PL%20-%20BruDolina%20Studios%20(1080p,%20h264).mp4";

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicjalizacja odtwarzacza...');
    console.log('URL wideo:', videoUrl);
    
    initVideoPlayer();
    initEventListeners();
    
    // Spróbuj załadować wideo od razu
    loadVideo();
});

function loadVideo() {
    console.log('Ładowanie wideo...');
    videoLoading.classList.add('show');
    videoInfo.style.display = 'block';
    
    // Ustaw źródło wideo
    videoPlayer.src = videoUrl;
    
    // Spróbuj załadować
    videoPlayer.load();
}

function initVideoPlayer() {
    // Ustaw początkową głośność
    updateVolumeDisplay();
    
    // Event listeners dla wideo
    videoPlayer.addEventListener('loadstart', function() {
        console.log('Rozpoczęto ładowanie wideo');
        videoLoading.classList.add('show');
    });
    
    videoPlayer.addEventListener('loadeddata', function() {
        console.log('Dane wideo załadowane');
        videoLoading.classList.remove('show');
        videoInfo.style.display = 'none';
    });
    
    videoPlayer.addEventListener('canplay', function() {
        console.log('Wideo gotowe do odtwarzania');
        videoLoading.classList.remove('show');
        videoInfo.style.display = 'none';
    });
    
    videoPlayer.addEventListener('canplaythrough', function() {
        console.log('Wideo może być odtworzone do końca bez przerw');
        videoLoading.classList.remove('show');
        videoInfo.style.display = 'none';
    });
    
    videoPlayer.addEventListener('waiting', function() {
        console.log('Wideo czeka na dane');
        videoLoading.classList.add('show');
    });
    
    videoPlayer.addEventListener('playing', function() {
        console.log('Wideo odtwarza się');
        videoLoading.classList.remove('show');
        videoInfo.style.display = 'none';
    });
    
    videoPlayer.addEventListener('progress', function() {
        // Pokazuj postęp ładowania
        if (videoPlayer.buffered.length > 0) {
            const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
            const duration = videoPlayer.duration;
            if (duration > 0) {
                const percent = (bufferedEnd / duration) * 100;
                console.log('Zbuforowano: ' + percent.toFixed(1) + '%');
            }
        }
    });
    
    videoPlayer.addEventListener('error', function(e) {
        console.error('Błąd wideo:', e);
        console.error('Kod błędu:', videoPlayer.error);
        
        videoLoading.classList.remove('show');
        videoInfo.innerHTML = `
            <div class="error-message">
                <h3>Błąd ładowania wideo</h3>
                <p>Nie udało się załadować wideo z GitHub.</p>
                <p>Możliwe przyczyny:</p>
                <ul>
                    <li>Plik jest zbyt duży dla GitHub</li>
                    <li>Problem z połączeniem internetowym</li>
                    <li>Blokada CORS</li>
                </ul>
                <button onclick="retryLoadVideo()" class="retry-btn">Spróbuj ponownie</button>
            </div>
        `;
    });
    
    videoPlayer.addEventListener('stalled', function() {
        console.log('Pobieranie wideo zostało wstrzymane');
        videoLoading.classList.add('show');
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

function retryLoadVideo() {
    console.log('Ponowne ładowanie wideo...');
    loadVideo();
}

function changeEpisode(episodeNumber) {
    if (episodeNumber === 1) {
        // Resetuj do początku
        videoPlayer.currentTime = 0;
        videoPlayer.play().catch(error => {
            console.log('Automatyczne odtwarzanie zablokowane:', error);
        });
    }
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
        videoPlayer.play().catch(error => {
            console.log('Błąd odtwarzania:', error);
            alert('Kliknij w wideo aby rozpocząć odtwarzanie');
        });
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
    if (videoPlayer.duration) {
        const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        const progressFill = document.querySelector('.episode-card.active .progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }
});

// Próba autoplay po załadowaniu
videoPlayer.addEventListener('loadeddata', function() {
    // Poczekaj chwilę i spróbuj odtworzyć
    setTimeout(() => {
        videoPlayer.play().catch(error => {
            console.log('Automatyczne odtwarzanie zablokowane, wymaga interakcji użytkownika');
        });
    }, 1000);
});
