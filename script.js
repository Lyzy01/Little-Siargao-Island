// --- 1. LOADER OVERLAY LOGIC ---
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

// --- 2. STATS & EASING COUNTERS ---
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

        animateValue("visits", 0, v, 2500);
        animateValue("playing", 0, p, 2500);
        animateValue("favs", 0, f, 2500);
    } catch (e) { console.error("Stats Error:", e); }
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

// --- 3. YOUTUBE MUSIC LOGIC ---
var player;

// This function MUST be global for the YouTube API to find it
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'unnHxxwN9IQ',
        playerVars: { 
            'autoplay': 1, 
            'loop': 1, 
            'playlist': 'unnHxxwN9IQ', 
            'controls': 0, 
            'mute': 1 // Start muted to satisfy browser rules
        },
        events: {
            'onReady': (event) => {
                console.log("Player Ready. Waiting for user click to unmute...");
                
                const startMusic = () => {
                    player.unMute();
                    player.setVolume(document.getElementById('vol').value);
                    player.playVideo();
                    window.removeEventListener('click', startMusic);
                };

                // Music starts on the very first click anywhere on the page
                window.addEventListener('click', startMusic);
                
                document.getElementById('vol').oninput = (e) => {
                    if(player && player.setVolume) player.setVolume(e.target.value);
                };
            },
            'onStateChange': (event) => {
                if (event.data === YT.PlayerState.ENDED) player.playVideo();
            }
        }
    });
};

// Initialize everything
updateStats();
