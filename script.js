// --- 1. LOADER ---
window.addEventListener('DOMContentLoaded', () => {
    let count = 0;
    const counter = document.getElementById('load-number');
    const overlay = document.getElementById('loader-overlay');
    const timer = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1;
        if(count >= 100) {
            count = 100;
            clearInterval(timer);
            setTimeout(() => { 
                overlay.style.opacity = '0'; 
                setTimeout(() => overlay.remove(), 800);
            }, 500);
        }
        counter.innerText = count;
    }, 50);
});

// --- 2. STATS & ERROR PROTECTION ---
async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        
        // Safety check: Only update if the data actually exists
        if (data.name) document.getElementById('title').innerText = data.name;
        if (data.creator) document.getElementById('dev').innerText = `by ${data.creator}`;
        if (data.icon) document.getElementById('gameIcon').src = data.icon;
        if (data.thumb) document.getElementById('thumb').src = data.thumb;
        if (data.rating) document.getElementById('rating').innerText = data.rating;

        if (data.visits) animate("visits", parseInt(data.visits.replace(/,/g, '')) || 0);
        if (data.playing) animate("playing", parseInt(data.playing.replace(/,/g, '')) || 0);
        if (data.favorites) animate("favs", parseInt(data.favorites.replace(/,/g, '')) || 0);
    } catch(e) { console.log("Waiting for API..."); }
}

function animate(id, end) {
    const obj = document.getElementById(id);
    let start = parseInt(obj.innerText.replace(/,/g, '')) || 0;
    if(start === end) return;
    
    let duration = 2000;
    let startTimestamp = null;
    const step = (ts) => {
        if(!startTimestamp) startTimestamp = ts;
        const progress = Math.min((ts - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        obj.innerText = Math.floor(easeOut * (end - start) + start).toLocaleString();
        if(progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// --- 3. MUSIC AUTOPLAY FIX ---
var player;
var isPlaying = false;

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: {
            'onReady': () => {
                const playBtn = document.getElementById('play-pause-btn');
                const playIcon = document.getElementById('play-icon');
                const pauseIcon = document.getElementById('pause-icon');

                // UNLOCK AUDIO ON FIRST CLICK ANYWHERE
                const startAudio = () => {
                    if (!isPlaying) {
                        player.unMute();
                        player.playVideo();
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                        isPlaying = true;
                    }
                };
                window.addEventListener('click', startAudio, { once: true });

                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isPlaying) {
                        player.pauseVideo();
                        playIcon.style.display = 'block';
                        pauseIcon.style.display = 'none';
                    } else {
                        player.playVideo();
                        player.unMute();
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                    }
                    isPlaying = !isPlaying;
                });

                document.getElementById('vol').oninput = (v) => player.setVolume(v.target.value);
            }
        }
    });
};

updateStats();
setInterval(updateStats, 5000);
