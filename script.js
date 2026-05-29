// Loader Overlay Logic
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

// Update UI with Easing Counters
async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        // Static Content
        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
        document.getElementById('rating').innerText = data.rating;

        // Numeric Counters (Remove commas for math)
        const v = parseInt(data.visits.replace(/,/g, '')) || 0;
        const p = parseInt(data.playing.replace(/,/g, '')) || 0;
        const f = parseInt(data.favorites.replace(/,/g, '')) || 0;

        // Animate with Easing (2.5 seconds)
        animateValue("visits", 0, v, 2500);
        animateValue("playing", 0, p, 2500);
        animateValue("favs", 0, f, 2500);

    } catch (e) { console.error(e); }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = Math.floor(easedProgress * (end - start) + start);
        
        obj.innerHTML = currentVal.toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

updateStats();

// YouTube Player Logic
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: { 'onReady': () => {
            const start = () => {
                player.unMute();
                player.playVideo();
                window.removeEventListener('click', start);
            };
            window.addEventListener('click', start);
            document.getElementById('vol').oninput = (e) => player.setVolume(e.target.value);
        }}
    });
}
