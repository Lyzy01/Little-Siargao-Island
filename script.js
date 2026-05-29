// --- 1. LOADER ---
window.addEventListener('DOMContentLoaded', () => {
    let count = 0;
    const counter = document.getElementById('load-number');
    const overlay = document.getElementById('loader-overlay');
    const timer = setInterval(() => {
        count += Math.floor(Math.random() * 15) + 1;
        if(count >= 100) {
            count = 100;
            clearInterval(timer);
            setTimeout(() => { 
                overlay.style.opacity = '0'; 
                setTimeout(() => overlay.remove(), 800);
            }, 500);
        }
        counter.innerText = count;
    }, 60);
});

// --- 2. STATS ---
async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        
        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
        document.getElementById('rating').innerText = data.rating;

        // Animate numbers from old value to new value
        animate("visits", parseInt(data.visits.replace(/,/g, '')) || 0);
        animate("playing", parseInt(data.playing.replace(/,/g, '')) || 0);
        animate("favs", parseInt(data.favorites.replace(/,/g, '')) || 0);
    } catch(e) { console.log(e); }
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

// --- 3. MUSIC ---
var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: {
            'onReady': (e) => {
                // UNMUTE ON FIRST CLICK
                const start = () => {
                    player.unMute();
                    player.playVideo();
                    window.removeEventListener('click', start);
                };
                window.addEventListener('click', start);
                document.getElementById('vol').oninput = (v) => player.setVolume(v.target.value);
            }
        }
    });
};

updateStats();
setInterval(updateStats, 5000);
