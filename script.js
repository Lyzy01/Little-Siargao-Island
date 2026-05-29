// YouTube-style Loading Counter
window.addEventListener('DOMContentLoaded', () => {
    let count = 0;
    const counterNode = document.getElementById('load-number');
    const overlay = document.getElementById('loader-overlay');
    
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

async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('playing').innerText = data.playing;
        document.getElementById('visits').innerText = data.visits;
        document.getElementById('favs').innerText = data.favorites;
        document.getElementById('rating').innerText = data.rating;
        
        // Image Fixes
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
    } catch (e) { console.error(e); }
}

updateStats();

// Music Setup
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
