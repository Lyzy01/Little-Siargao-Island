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
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
    } catch (e) { console.error("Update failed", e); }
}

updateStats();
setInterval(updateStats, 60000);

// YouTube Audio Logic
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: { 'onReady': () => {
            const unlock = () => {
                player.unMute();
                player.playVideo();
                window.removeEventListener('click', unlock);
            };
            window.addEventListener('click', unlock);
            document.getElementById('vol').oninput = (e) => player.setVolume(e.target.value);
        }}
    });
}
