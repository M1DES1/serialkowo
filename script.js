// Dane serialu
const hazbinHotelData = {
    seasons: {
        1: [
            {
                number: 0,
                title: "Pilot",
                description: "Odcinek pilotażowy",
                duration: "32:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/HAZBIN%20HOTEL%20(PILOT)%20%20Dubbing%20PL%20-%20BruDolina%20Studios%20(1080p,%20h264).mp4"
            },
            {
                number: 1,
                title: "Uwertura",
                description: "Odcinek 1",
                duration: "24:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc1%20Uwertura.mp4"
            },
            {
                number: 2,
                title: "Radio zabiło gwiazdę",
                description: "Odcinek 2",
                duration: "22:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%202%20Radio%20zabi%C5%82o%20gwiazd%C4%99%20wideo.mp4"
            },
            {
                number: 3,
                title: "Jajecznica",
                description: "Odcinek 3",
                duration: "25:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%203Jajecznica.mp4"
            },
            {
                number: 4,
                title: "Maskarada",
                description: "Odcinek 4",
                duration: "23:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%204Maskarada.mp4"
            },
            {
                number: 5,
                title: "Pojedynek o ojcostwo",
                description: "Odcinek 5",
                duration: "26:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc5%20Pojedynek%20o%20ojcostwo.m3u8"
            },
            {
                number: 6,
                title: "Witamy w niebie",
                description: "Odcinek 6",
                duration: "24:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc6%20Witamy%20w%20niebie.mp4"
            },
            {
                number: 7,
                title: "Hejka, Rosie!",
                description: "Odcinek 7",
                duration: "25:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc7%20Hejka,%20Rosie!.m3u8"
            },
            {
                number: 8,
                title: "Przedstawienie musi trwać",
                description: "Odcinek 8",
                duration: "27:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%208%20Przedstawienie%20musi%20trwa%C4%87.m3u8"
            }
        ],
        2: [
            {
                number: 1,
                title: "Nowy Pentious",
                description: "Odcinek 1",
                duration: "24:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc9%20Nowy%20Pentious.m3u8"
            },
            {
                number: 2,
                title: "Gawędziarz",
                description: "Odcinek 2",
                duration: "23:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%2010%20Gaw%C4%99dziarz.m3u8"
            },
            {
                number: 3,
                title: "Hazbin Hotel za zamkniętymi drzwiami",
                description: "Odcinek 3",
                duration: "25:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%2011%20Hazbin%20Hotel%20za%20zamkni%C4%99tymi%20drzwiami.m3u8"
            },
            {
                number: 4,
                title: "Umowa stoi",
                description: "Odcinek 4",
                duration: "26:00",
                videoUrl: "https://github.com/M1DES1/serialkowo/raw/refs/heads/main/seriale/hazbinhotel/odc%2012%20Umowa%20stoi.m3u8"
            }
        ]
    }
};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona załadowana');
    initEventListeners();
    
    // Inicjalizacja strony z odcinkami
    if (window.location.pathname.includes('hazbin-hotel.html') || window.location.pathname.endsWith('/')) {
        initEpisodesPage();
    }
});

// Inicjalizacja strony z odcinkami
function initEpisodesPage() {
    const seasonButtons = document.querySelectorAll('.season-btn');
    const episodesList = document.getElementById('episodes-list');
    const seasonTitle = document.getElementById('season-title');
    
    if (!episodesList) return; // Jeśli nie ma listy odcinków, wyjdź
    
    console.log('Inicjalizacja strony z odcinkami');
    
    // Ładuj domyślnie sezon 1
    loadSeason(1, episodesList, seasonTitle);
    
    // Obsługa zmiany sezonu
    seasonButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const season = parseInt(this.getAttribute('data-season'));
            console.log('Kliknięto sezon:', season);
            
            // Aktualizuj aktywne przyciski
            seasonButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Załaduj odcinki dla wybranego sezonu
            loadSeason(season, episodesList, seasonTitle);
        });
    });
}

// Ładowanie odcinków dla sezonu
function loadSeason(seasonNumber, episodesList, seasonTitle) {
    const episodes = hazbinHotelData.seasons[seasonNumber];
    
    if (!episodes) {
        episodesList.innerHTML = '<p>Brak odcinków dla tego sezonu.</p>';
        return;
    }
    
    seasonTitle.textContent = `Sezon ${seasonNumber} - Odcinki:`;
    episodesList.innerHTML = '';
    
    episodes.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.setAttribute('data-episode', episode.number);
        episodeCard.setAttribute('data-season', seasonNumber);
        
        episodeCard.innerHTML = `
            <div class="episode-number">${episode.number.toString().padStart(2, '0')}</div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <p>${episode.description} • ${episode.duration}</p>
            </div>
        `;
        
        episodeCard.addEventListener('click', function() {
            const episodeNumber = parseInt(this.getAttribute('data-episode'));
            const seasonNumber = parseInt(this.getAttribute('data-season'));
            console.log('Kliknięto odcinek:', episodeNumber, 'Sezon:', seasonNumber);
            playEpisode(episodeNumber, seasonNumber);
        });
        
        episodesList.appendChild(episodeCard);
    });
    
    console.log(`Załadowano ${episodes.length} odcinków sezonu ${seasonNumber}`);
}

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
}

// Odtwarzanie odcinka
function playEpisode(episodeNumber, seasonNumber = 1) {
    console.log('Próba odtworzenia odcinka:', episodeNumber, 'Sezon:', seasonNumber);
    
    const episodes = hazbinHotelData.seasons[seasonNumber];
    const episode = episodes.find(ep => ep.number === episodeNumber);
    
    if (episode) {
        console.log('Znaleziono odcinek:', episode);
        
        // Przekierowanie do odtwarzacza z numerem odcinka i sezonu
        window.location.href = `player.html?episode=${episodeNumber}&season=${seasonNumber}`;
        
    } else {
        console.error('Nie znaleziono odcinka:', episodeNumber);
        alert('Nie znaleziono odcinka!');
    }
}

console.log('Serialkowo zainicjalizowane');
