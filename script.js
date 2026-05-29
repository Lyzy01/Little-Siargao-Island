// --- 1. LOADER ---
window.addEventListener('DOMContentLoaded', () => {
    let count = 0;
    const counterNode = document.getElementById('load-number');
    const overlay = document.getElementById('loader-overlay');
    const loader = setInterval(() => {
        count += Math.floor(Math.random() * 12) + 1;
        if (count >= 100) {
            count = 100;
            clearInterval(loader);
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, 400);
        }
        counterNode.innerText = count;
    }, 50);
});

// --- 2. STATS & YT COUNTERS ---
async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        
        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
        document.getElementById('rating').innerText = data.rating;

        const v = parseInt(data.visits.replace(/,/g, '')) || 0;
        const p = parseInt(data.playing.replace(/,/g, '')) || 0;
        const f = parseInt(data.favorites.replace(/,/g, '')) || 0;

        animateValue("visits", v, 2000);
        animateValue("playing", p, 2000);
        animateValue("favs", f, 2000);
    } catch (e) { console.error(e); }
}

function animateValue(id, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let start = parseInt(obj.innerHTML.replace(/,/g, '')) || 0;
    let startTimestamp = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(easeOutCubic(progress) * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// --- 3. AUTO-PLAY MUSIC LOGIC ---
var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: {
            'onReady': () => {
                // Browser fix: Music starts on FIRST click anywhere
                const playOnFirstClick = () => {
                    player.unMute();
                    player.playVideo();
                    window.removeEventListener('click', playOnFirstClick);
                };
                window.addEventListener('click', playOnFirstClick);
                
                document.getElementById('vol').oninput = (e) => player.setVolume(e.target.value);
            }
        }
    });
};

updateStats();
setInterval(updateStats, 5000);
