// Dane serialu
const hazbinHotelData = {
    episodes: [
        // Sezon 1
        {
            number: 1,
            title: "Uwertura",
            duration: "32:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc1%20Uwertura.mp4"
        },
        {
            number: 2,
            title: "Radio zabiło gwiazdę wideo",
            duration: "28:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%202%20Radio%20zabi%C5%82o%20gwiazd%C4%99%20wideo.mp4"
        },
        {
            number: 3,
            title: "Jajecznica",
            duration: "26:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%203Jajecznica.mp4"
        },
        {
            number: 4,
            title: "Maskarada",
            duration: "29:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%204Maskarada.mp4"
        },
        {
            number: 5,
            title: "Pojedynek o ojcostwo",
            duration: "31:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc5%20Pojedynek%20o%20ojcostwo.m3u8"
        },
        {
            number: 6,
            title: "Witamy w niebie",
            duration: "33:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc6%20Witamy%20w%20niebie.mp4"
        },
        {
            number: 7,
            title: "Hejka, Rosie!",
            duration: "27:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc7%20Hejka,%20Rosie!.m3u8"
        },
        {
            number: 8,
            title: "Przedstawienie musi trwać",
            duration: "35:00",
            season: 1,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%208%20Przedstawienie%20musi%20trwa%C4%87.m3u8"
        },
        // Sezon 2
        {
            number: 9,
            title: "Nowy Pentious",
            duration: "30:00",
            season: 2,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc9%20Nowy%20Pentious.m3u8"
        },
        {
            number: 10,
            title: "Gawędziarz",
            duration: "28:00",
            season: 2,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%2010%20Gaw%C4%99dziarz.m3u8"
        },
        {
            number: 11,
            title: "Hazbin Hotel za zamkniętymi drzwiami",
            duration: "32:00",
            season: 2,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%2011%20Hazbin%20Hotel%20za%20zamkni%C4%99tymi%20drzwiami.m3u8"
        },
        {
            number: 12,
            title: "Umowa stoi",
            duration: "34:00",
            season: 2,
            videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%2012%20Umowa%20stoi.m3u8"
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
let autoPlayCountdown = null;
let countdownInterval = null;
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
});

function initEventListeners() {
    // Video events
    videoPlayer.addEventListener('loadstart', showLoading);
    videoPlayer.addEventListener('canplay', hideLoading);
    videoPlayer.addEventListener('waiting', showLoading);
    videoPlayer.addEventListener('playing', hideLoading);
    videoPlayer.addEventListener('timeupdate', updateProgress);
    videoPlayer.addEventListener('progress', updateBuffer);
    videoPlayer.addEventListener('ended', showAutoPlayCountdown);
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
    const progressContainer = document.querySelector('.progress-container');
    progressContainer.addEventListener('mousedown', startSeeking);
    document.addEventListener('mousemove', handleProgressDrag);
    document.addEventListener('mouseup', stopSeeking);
}

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
            <a href="${hazbinHotelData.episodes[currentEpisode - 1].videoUrl}" 
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

function initVolumeControl() {
    videoPlayer.volume = 1;
    volumeSlider.value = 1;
    updateVolumeIcon();
}

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

function initEpisodesSidebar() {
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.innerHTML = '';
    
    let currentSeason = 0;
    
    hazbinHotelData.episodes.forEach(episode => {
        if (episode.season !== currentSeason) {
            currentSeason = episode.season;
            const seasonHeader = document.createElement('div');
            seasonHeader.className = 'season-header';
            seasonHeader.innerHTML = `<h4>Sezon ${currentSeason}</h4>`;
            seasonHeader.style.cssText = `
                color: #e50914;
                font-size: 1.1rem;
                font-weight: bold;
                margin: 20px 0 10px 0;
                padding-bottom: 5px;
                border-bottom: 1px solid #333;
            `;
            sidebarContent.appendChild(seasonHeader);
        }
        
        const episodeItem = document.createElement('div');
        episodeItem.className = `episode-side-item ${episode.number === currentEpisode ? 'active' : ''}`;
        episodeItem.setAttribute('data-episode', episode.number);
        
        episodeItem.innerHTML = `
            <div class="episode-side-content">
                <span class="episode-side-num">${episode.number > 8 ? (episode.number - 8).toString().padStart(2, '0') : episode.number.toString().padStart(2, '0')}</span>
                <div class="episode-side-info">
                    <span class="episode-side-title">${episode.title}</span>
                    <span class="episode-side-duration">Sezon ${episode.season} • ${episode.duration}</span>
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
        cancelAutoPlay();
        
        hideCenterButton();
        
        videoPlayer.load();
        
        videoPlayer.addEventListener('canplay', function onCanPlay() {
            videoPlayer.removeEventListener('canplay', onCanPlay);
            console.log('Wideo gotowe do odtwarzania');
            hideLoading();
            showCenterButton();
        }, { once: true });
        
    } else {
        console.error('Nie znaleziono odcinka:', episodeNumber);
    }
}

function hideCenterButton() {
    const centerControls = document.querySelector('.center-controls');
    centerControls.style.opacity = '0';
    centerControls.style.pointerEvents = 'none';
}

function showCenterButton() {
    const centerControls = document.querySelector('.center-controls');
    centerControls.style.opacity = '1';
    centerControls.style.pointerEvents = 'auto';
}

function handleVideoClick(event) {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 300) {
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

function togglePlayPause() {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
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
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    videoPlayer.currentTime += seconds;
    showControlsTemporarily();
}

function toggleMute() {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    videoPlayer.muted = !videoPlayer.muted;
    updateVolumeIcon();
    showControlsTemporarily();
}

function changeVolume(value) {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
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
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    currentSpeedIndex = (currentSpeedIndex + 1) % playbackRates.length;
    const speed = playbackRates[currentSpeedIndex];
    videoPlayer.playbackRate = speed;
    speedText.textContent = speed + 'x';
    showControlsTemporarily();
}

function toggleEpisodesList() {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    isSidebarOpen = !isSidebarOpen;
    episodesSidebar.classList.toggle('open', isSidebarOpen);
    showControlsTemporarily();
}

function toggleFullscreen() {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    if (!document.fullscreenElement) {
        videoPlayer.parentElement.requestFullscreen().catch(err => {
            console.log('Błąd pełnego ekranu:', err);
        });
    } else {
        document.exitFullscreen();
    }
    showControlsTemporarily();
}

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
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    const progressContainer = event.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    videoPlayer.currentTime = percent * videoPlayer.duration;
    showControlsTemporarily();
}

function startSeeking(event) {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    isSeeking = true;
    handleProgressDrag(event);
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

function showControlsTemporarily() {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
    controlsOverlay.classList.add('visible');
    clearTimeout(controlsTimeout);
    
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
    
    const nextEpisodeNumber = episodeNumber + 1;
    const nextEpisode = hazbinHotelData.episodes.find(ep => ep.number === nextEpisodeNumber);
    nextEpisodeBtn.disabled = !nextEpisode;
    
    if (nextEpisode) {
        nextEpisodeBtn.innerHTML = `Następny odcinek <svg class="btn-icon" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"/></svg>`;
    } else {
        nextEpisodeBtn.innerHTML = `Koniec serialu <svg class="btn-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
    }
}

function showLoading() {
    loadingSpinner.classList.add('show');
    hideCenterButton();
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
    showCenterButton();
}

function showEndScreen() {
    endScreen.classList.add('show');
}

function hideEndScreen() {
    endScreen.classList.remove('show');
}

function showAutoPlayCountdown() {
    const nextEpisodeNumber = currentEpisode + 1;
    const nextEpisode = hazbinHotelData.episodes.find(ep => ep.number === nextEpisodeNumber);
    
    if (nextEpisode) {
        hideEndScreen();
        showCountdownScreen(nextEpisode);
    } else {
        showEndScreen();
    }
}

function showCountdownScreen(nextEpisode) {
    const countdownScreen = document.createElement('div');
    countdownScreen.className = 'countdown-screen show';
    countdownScreen.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 60;
    `;
    
    let countdownValue = 10;
    
    countdownScreen.innerHTML = `
        <div class="countdown-content" style="
            text-align: center;
            background: rgba(26, 26, 26, 0.95);
            padding: 40px;
            border-radius: 20px;
            border: 3px solid #e50914;
            backdrop-filter: blur(15px);
            max-width: 500px;
            width: 90%;
        ">
            <div class="countdown-icon" style="font-size: 4rem; margin-bottom: 20px;">⏱️</div>
            <h3 style="color: white; margin-bottom: 15px; font-size: 1.8rem;">Następny odcinek za:</h3>
            <div class="countdown-timer" style="
                font-size: 3rem;
                color: #e50914;
                font-weight: bold;
                margin: 20px 0;
                font-family: monospace;
            ">${countdownValue}s</div>
            <p style="color: #ccc; margin-bottom: 25px; font-size: 1.1rem;">
                Następny: <strong>${nextEpisode.title}</strong> (Sezon ${nextEpisode.season})
            </p>
            <div class="countdown-buttons" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="modern-btn secondary" onclick="cancelAutoPlay()" style="
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    border: 1px solid;
                    font-size: 0.95rem;
                ">
                    Anuluj
                </button>
                <button class="modern-btn primary" onclick="playNextEpisodeNow()" style="
                    background: #e50914;
                    border-color: #e50914;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    border: 1px solid;
                    font-size: 0.95rem;
                    font-weight: 600;
                ">
                    Odtwórz teraz
                </button>
            </div>
        </div>
    `;
    
    videoPlayer.parentElement.appendChild(countdownScreen);
    
    const countdownElement = countdownScreen.querySelector('.countdown-timer');
    countdownInterval = setInterval(() => {
        countdownValue--;
        countdownElement.textContent = countdownValue + 's';
        
        if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            playNextEpisodeNow();
        }
    }, 1000);
    
    autoPlayCountdown = countdownScreen;
}

function cancelAutoPlay() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    if (autoPlayCountdown) {
        autoPlayCountdown.remove();
        autoPlayCountdown = null;
    }
    window.location.href = 'index.html';
}

function playNextEpisodeNow() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    if (autoPlayCountdown) {
        autoPlayCountdown.remove();
        autoPlayCountdown = null;
    }
    playNextEpisode();
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
    } else {
        window.location.href = 'index.html';
    }
    hideEndScreen();
}

function changeEpisode(episodeNumber) {
    loadEpisode(episodeNumber);
    if (isSidebarOpen) {
        toggleEpisodesList();
    }
}

function handleKeyboard(event) {
    if (loadingSpinner.classList.contains('show')) {
        return;
    }
    
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
