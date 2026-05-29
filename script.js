// YouTube-style Loading Counter
window.addEventListener('DOMContentLoaded', () => {
    let count = 0;
    const counterNode = document.getElementById('load-number');
    const overlay = document.getElementById('loader-overlay');
    
    // Check if element exists to avoid errors
    if (!counterNode || !overlay) return;

    const loader = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1;
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

// Update UI with Data and Animated Counters
async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        if (data.error) {
            console.error("Backend Error:", data.error);
            return;
        }

        // Set non-numeric text and images immediately
        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
        document.getElementById('rating').innerText = data.rating;

        // Start the animated counting for stats
        // We strip commas from the strings to turn them back into numbers for the math
        const visitsNum = parseInt(data.visits.replace(/,/g, '')) || 0;
        const playingNum = parseInt(data.playing.replace(/,/g, '')) || 0;
        const favsNum = parseInt(data.favorites.replace(/,/g, '')) || 0;

        animateValue("visits", 0, visitsNum, 2000);
        animateValue("playing", 0, playingNum, 2000);
        animateValue("favs", 0, favsNum, 2000);

    } catch (e) { 
        console.error("Fetch/Update Error:", e); 
    }
}

// Logic for the counting animation
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize
updateStats();

// Music Setup
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: { 'onReady': () => {
            const start = () => {
                if (player && player.unMute) {
                    player.unMute();
                    player.playVideo();
                }
                window.removeEventListener('click', start);
            };
            window.addEventListener('click', start);
            document.getElementById('vol').oninput = (e) => player.setVolume(e.target.value);
        }}
    });
}
