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

// --- 2. STATS & YOUTUBE-STYLE ANIMATION ---
async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        // Update Text and Images
        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
        document.getElementById('rating').innerText = data.rating;

        // Convert string numbers (with commas) to clean integers
        const nextVisits = parseInt(data.visits.replace(/,/g, '')) || 0;
        const nextPlaying = parseInt(data.playing.replace(/,/g, '')) || 0;
        const nextFavs = parseInt(data.favorites.replace(/,/g, '')) || 0;

        // Animate from CURRENT value to NEW value
        // 2000ms (2 seconds) duration for that smooth rolling feel
        animateValue("visits", nextVisits, 2000);
        animateValue("playing", nextPlaying, 2000);
        animateValue("favs", nextFavs, 2000);

    } catch (e) { 
        console.error("Stats Update Error:", e); 
    }
}

function animateValue(id, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    // Grab the number currently on the screen as the starting point
    // This prevents the counter from resetting to 0 on every 5-second refresh
    let start = parseInt(obj.innerHTML.replace(/,/g, '')) || 0;
    
    // If the number hasn't changed, don't restart the animation
    if (start === end) return;

    let startTimestamp = null;
    
    // Cubic Ease-Out: Starts fast, then significantly slows down at the end (YouTube style)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        // Calculate the current frame value
        const currentVal = Math.floor(easedProgress * (end - start) + start);
        
        // Format with commas for the dashboard look
        obj.innerHTML = currentVal.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- 3. YOUTUBE PLAYER (MUSIC) ---
var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 
            'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 
            'controls': 0, 'mute': 1 
        },
        events: {
            'onReady': () => {
                const startMusic = () => {
                    if(player && player.unMute) {
                        player.unMute();
                        player.setVolume(document.getElementById('vol').value);
                        player.playVideo();
                        window.removeEventListener('click', startMusic);
                    }
                };
                window.addEventListener('click', startMusic);
                document.getElementById('vol').oninput = (e) => player.setVolume(e.target.value);
            }
        }
    });
};

// --- 4. START & AUTO-REFRESH ---
updateStats(); // Initial load

// Refresh every 5 seconds
setInterval(updateStats, 5000);
