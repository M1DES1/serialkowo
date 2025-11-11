// Dane serialu
const hazbinHotelData = {
    episodes: [
        {
            number: 1,
            title: "Pilot",
            duration: "32:00",
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/HAZBIN%20HOTEL%20(PILOT)%20%20Dubbing%20PL%20-%20BruDolina%20Studios%20(1080p,%20h264).mp4"
        }
    ]
};

// Elementy DOM
const videoPlayer = document.getElementById('video-player');
const controlsOverlay = document.getElementById('controls-overlay');
const loadingSpinner = document.getElementById('loading-spinner');
const endScreen = document.getElementById('end-screen');
const episodesSidebar = document.getElementById('episodes-sidebar');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const progressBuffer = document.getElementById('progress-buffer');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.querySelector('.volume-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseSmall = document.getElementById('play-pause-small');
const nextEpisodeBtn = document.getElementById('next-episode-btn');
const speedText = document.getElementById('speed-text');

// Zmienne
let currentEpisode = 1;
let isSeeking = false;
let isSidebarOpen = false;
let lastClickTime = 0;
let controlsTimeout;
let isMouseMoving = false;
let mouseMoveTimeout;
const playbackRates = [0.75, 1, 1.25, 1.5, 2];
let currentSpeedIndex = 1;

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const episodeParam = urlParams.get('episode');
    
    if (episodeParam) {
        currentEpisode = parseInt(episodeParam);
    }
    
    loadEpisode(currentEpisode);
    initEventListeners();
    initVolumeControl();
    initEpisodesSidebar();
    showControlsTemporarily();
});

function initEventListeners() {
    // Video events
    videoPlayer.addEventListener('loadstart', showLoading);
    videoPlayer.addEventListener('canplay', hideLoading);
    videoPlayer.addEventListener('waiting', showLoading);
    videoPlayer.addEventListener('playing', hideLoading);
    videoPlayer.addEventListener('timeupdate', updateProgress);
    videoPlayer.addEventListener('progress', updateBuffer);
    videoPlayer.addEventListener('ended', showEndScreen);
    videoPlayer.addEventListener('volumechange', updateVolumeUI);
    videoPlayer.addEventListener('play', updatePlayState);
    videoPlayer.addEventListener('pause', updatePlayState);
    videoPlayer.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(videoPlayer.duration);
    });
    
    // Error handling
    videoPlayer.addEventListener('error', function(e) {
        console.error('Błąd wideo:', e);
        console.error('Kod błędu:', videoPlayer.error);
        console.error('URL wideo:', videoPlayer.src);
        hideLoading();
        showManualDownloadOption();
    });
    
    // Mouse movement detection
    document.addEventListener('mousemove', function() {
        if (!isMouseMoving) {
            isMouseMoving = true;
            showControlsTemporarily();
        }
        
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });
    
    // Click events
    videoPlayer.addEventListener('click', handleVideoClick);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboard);
    
    // Progress bar events
    document.addEventListener('mousemove', handleProgressDrag);
    document.addEventListener('mouseup', stopSeeking);
}

// Pokazuj opcję ręcznego pobrania jeśli wideo nie działa
function showManualDownloadOption() {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        z-index: 100;
        border: 2px solid #e50914;
        max-width: 500px;
        width: 90%;
    `;
    
    errorMessage.innerHTML = `
        <h3>Problem z odtwarzaniem wideo</h3>
        <p>Wideo nie może być odtworzone bezpośrednio w przeglądarce.</p>
        <p>Możesz:</p>
        <div style="margin: 20px 0;">
            <a href="${hazbinHotelData.episodes[0].videoUrl}" 
               download 
               style="background: #e50914; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px;">
               📥 Pobierz odcinek
            </a>
        </div>
        <p style="font-size: 0.9rem; color: #ccc;">
            Po pobraniu otwórz plik w odtwarzaczu wideo na swoim urządzeniu.
        </p>
    `;
    
    videoPlayer.parentElement.appendChild(errorMessage);
}

// Inicjalizacja kontroli głośności
function initVolumeControl() {
    videoPlayer.volume = 1;
    volumeSlider.value = 1;
    updateVolumeIcon();
}



function showLoading() {
    loadingSpinner.classList.add('show');
    // UKRYJ przycisk play/pause na środku podczas ładowania
    document.querySelector('.center-controls').style.display = 'none';
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
    // POKAŻ przycisk play/pause na środku po zakończeniu ładowania
    document.querySelector('.center-controls').style.display = 'flex';
}








// Aktualizacja ikony głośności
function updateVolumeIcon() {
    const volume = videoPlayer.volume;
    const isMuted = videoPlayer.muted || volume === 0;
    
    volumeBtn.classList.toggle('muted', isMuted);
    
    volumeBtn.querySelectorAll('.btn-icon').forEach(icon => {
        icon.style.display = 'none';
    });
    
    if (isMuted || volume === 0) {
        volumeBtn.querySelector('.volume-mute').style.display = 'block';
    } else if (volume < 0.5) {
        volumeBtn.querySelector('.volume-low').style.display = 'block';
    } else {
        volumeBtn.querySelector('.volume-high').style.display = 'block';
    }
}

// Inicjalizacja sidebar z odcinkami
function initEpisodesSidebar() {
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.innerHTML = '';
    
    hazbinHotelData.episodes.forEach(episode => {
        const episodeItem = document.createElement('div');
        episodeItem.className = `episode-side-item ${episode.number === currentEpisode ? 'active' : ''}`;
        episodeItem.setAttribute('data-episode', episode.number);
        
        episodeItem.innerHTML = `
            <div class="episode-side-content">
                <span class="episode-side-num">${episode.number.toString().padStart(2, '0')}</span>
                <div class="episode-side-info">
                    <span class="episode-side-title">${episode.title}</span>
                    <span class="episode-side-duration">${episode.duration}</span>
                </div>
            </div>
            <div class="episode-play-icon">▶</div>
        `;
        
        episodeItem.addEventListener('click', function() {
            const episodeNumber = parseInt(this.getAttribute('data-episode'));
            changeEpisode(episodeNumber);
        });
        
        sidebarContent.appendChild(episodeItem);
    });
}

function loadEpisode(episodeNumber) {
    const episode = hazbinHotelData.episodes.find(ep => ep.number === episodeNumber);
    
    if (episode) {
        showLoading();
        console.log('Ładowanie odcinka:', episodeNumber);
        
        videoPlayer.src = episode.videoUrl;
        currentEpisode = episodeNumber;
        
        updateEpisodeInfo(episodeNumber);
        hideEndScreen();
        
        videoPlayer.load();
        
        videoPlayer.addEventListener('canplay', function onCanPlay() {
            videoPlayer.removeEventListener('canplay', onCanPlay);
            console.log('Wideo gotowe do odtwarzania');
            hideLoading();
        }, { once: true });
        
    } else {
        console.error('Nie znaleziono odcinka:', episodeNumber);
    }
}

function handleVideoClick(event) {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 300) { // Double click
        event.preventDefault();
        togglePlayPause();
        showDoubleClickPause();
    } else {
        togglePlayPause();
    }
    
    lastClickTime = currentTime;
    showControlsTemporarily();
}

function showDoubleClickPause() {
    const pauseEffect = document.createElement('div');
    pauseEffect.className = 'double-click-pause';
    pauseEffect.textContent = videoPlayer.paused ? '⏸' : '▶';
    
    videoPlayer.parentElement.appendChild(pauseEffect);
    
    setTimeout(() => {
        pauseEffect.remove();
    }, 1000);
}

// Controls functions
function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play().catch(error => {
            console.log('Błąd odtwarzania:', error);
        });
    } else {
        videoPlayer.pause();
    }
    showControlsTemporarily();
}

function skipTime(seconds) {
    videoPlayer.currentTime += seconds;
    showControlsTemporarily();
}

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    updateVolumeIcon();
    showControlsTemporarily();
}

function changeVolume(value) {
    videoPlayer.volume = parseFloat(value);
    videoPlayer.muted = (videoPlayer.volume === 0);
    updateVolumeIcon();
    showControlsTemporarily();
}

function updateVolumeUI() {
    volumeSlider.value = videoPlayer.volume;
    updateVolumeIcon();
}

function toggleSpeed() {
    currentSpeedIndex = (currentSpeedIndex + 1) % playbackRates.length;
    const speed = playbackRates[currentSpeedIndex];
    videoPlayer.playbackRate = speed;
    speedText.textContent = speed + 'x';
    showControlsTemporarily();
}

function toggleEpisodesList() {
    isSidebarOpen = !isSidebarOpen;
    episodesSidebar.classList.toggle('open', isSidebarOpen);
    showControlsTemporarily();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoPlayer.parentElement.requestFullscreen().catch(err => {
            console.log('Błąd pełnego ekranu:', err);
        });
    } else {
        document.exitFullscreen();
    }
    showControlsTemporarily();
}

// Progress functions
function updateProgress() {
    if (!isSeeking && videoPlayer.duration) {
        const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressFill.style.width = progress + '%';
        progressThumb.style.left = progress + '%';
    }
    
    currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
}

function updateBuffer() {
    if (videoPlayer.buffered.length > 0 && videoPlayer.duration) {
        const buffered = (videoPlayer.buffered.end(0) / videoPlayer.duration) * 100;
        progressBuffer.style.width = buffered + '%';
    }
}

function handleProgressClick(event) {
    const progressContainer = event.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    videoPlayer.currentTime = percent * videoPlayer.duration;
    showControlsTemporarily();
}

function handleProgressDrag(event) {
    if (isSeeking) {
        const progressContainer = document.querySelector('.progress-container');
        const rect = progressContainer.getBoundingClientRect();
        let percent = (event.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        
        progressFill.style.width = (percent * 100) + '%';
        progressThumb.style.left = (percent * 100) + '%';
    }
}

function stopSeeking() {
    if (isSeeking) {
        isSeeking = false;
        const percent = parseFloat(progressFill.style.width) / 100;
        videoPlayer.currentTime = percent * videoPlayer.duration;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// UI controls visibility - POPRAWIONE
function showControlsTemporarily() {
    controlsOverlay.classList.add('visible');
    clearTimeout(controlsTimeout);
    
    // Ukryj kontrolki po 2 sekundach jeśli wideo jest odtwarzane
    if (!videoPlayer.paused) {
        controlsTimeout = setTimeout(() => {
            if (!isMouseMoving) {
                controlsOverlay.classList.remove('visible');
            }
        }, 2000);
    }
}

function updatePlayState() {
    const isPlaying = !videoPlayer.paused;
    const videoContainer = document.querySelector('.video-container');
    
    videoContainer.classList.toggle('video-playing', isPlaying);
    videoContainer.classList.toggle('paused', !isPlaying);
    document.querySelector('.play-btn').classList.toggle('video-playing', isPlaying);
    
    // Pokaż kontrolki przy zmianie stanu odtwarzania
    showControlsTemporarily();
}

function updateEpisodeInfo(episodeNumber) {
    document.querySelectorAll('.episode-side-item').forEach(item => {
        item.classList.remove('active');
        const itemEpisode = parseInt(item.getAttribute('data-episode'));
        
        if (itemEpisode === episodeNumber) {
            item.classList.add('active');
        }
    });
    
    nextEpisodeBtn.disabled = episodeNumber >= hazbinHotelData.episodes.length;
}

// Loading functions
function showLoading() {
    loadingSpinner.classList.add('show');
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
}

// End screen functions
function showEndScreen() {
    endScreen.classList.add('show');
}

function hideEndScreen() {
    endScreen.classList.remove('show');
}

function replayEpisode() {
    videoPlayer.currentTime = 0;
    videoPlayer.play();
    hideEndScreen();
}

function playNextEpisode() {
    const nextEpisode = currentEpisode + 1;
    if (nextEpisode <= hazbinHotelData.episodes.length) {
        changeEpisode(nextEpisode);
    }
    hideEndScreen();
}

function changeEpisode(episodeNumber) {
    loadEpisode(episodeNumber);
    if (isSidebarOpen) {
        toggleEpisodesList();
    }
}

// Keyboard controls
function handleKeyboard(event) {
    if (event.target.tagName === 'INPUT') return;
    
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
        case 'e':
        case 'E':
            event.preventDefault();
            toggleEpisodesList();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            skipTime(-10);
            break;
        case 'ArrowRight':
            event.preventDefault();
            skipTime(10);
            break;
        case 'ArrowUp':
            event.preventDefault();
            changeVolume(Math.min(1, videoPlayer.volume + 0.1));
            break;
        case 'ArrowDown':
            event.preventDefault();
            changeVolume(Math.max(0, videoPlayer.volume - 0.1));
            break;
        case '>':
        case '.':
            event.preventDefault();
            toggleSpeed();
            break;
    }
}

