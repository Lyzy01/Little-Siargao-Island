const PLACE_ID = "2753915549"; // Your ID
const PROXY = "https://corsproxy.io/?";

async function init() {
    try {
        const resId = await fetch(`${PROXY}https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);
        const idData = await resId.json();
        const universeId = idData.universeId;

        const [gameRes, favRes, voteRes] = await Promise.all([
            fetch(`${PROXY}https://games.roblox.com/v1/games?universeIds=${universeId}`),
            fetch(`${PROXY}https://games.roblox.com/v1/games/${universeId}/favorites/count`),
            fetch(`${PROXY}https://games.roblox.com/v1/games/${universeId}/votes`)
        ]);

        const gData = await gameRes.json();
        const fData = await favRes.json();
        const vData = await voteRes.json();
        const game = gData.data[0];

        document.getElementById('title').innerText = game.name;
        document.getElementById('dev').innerText = `by ${game.creator.name}`;
        document.getElementById('visits').innerText = game.visits.toLocaleString();
        document.getElementById('playing').innerText = game.playing.toLocaleString();
        document.getElementById('favs').innerText = fData.favoritesCount.toLocaleString();
        
        const rate = Math.round((vData.upVotes / (vData.upVotes + vData.downVotes)) * 100) || 0;
        document.getElementById('rating').innerText = rate + "%";

        document.getElementById('gameIcon').src = `https://www.roblox.com/asset-thumbnail/image?assetId=${PLACE_ID}&width=150&height=150&format=png`;
        document.getElementById('thumb').src = `${PROXY}https://thumbnails.roblox.com/v1/games/thumbnails?universeIds=${universeId}&size=768x432&format=Png&isCircular=false`;
    } catch (e) {}
}

init();
setInterval(init, 60000);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ' },
        events: { 'onReady': (e) => {
            const slider = document.getElementById('vol');
            player.setVolume(slider.value);
            slider.oninput = () => player.setVolume(slider.value);
            const startAudio = () => {
                player.playVideo();
                ["mousemove", "touchstart", "click"].forEach(ev => window.removeEventListener(ev, startAudio));
            };
            ["mousemove", "touchstart", "click"].forEach(ev => window.addEventListener(ev, startAudio));
        }}
    });
}

// Anti-Inspect Element
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = e => {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && [73, 67, 74].includes(e.keyCode)) || (e.ctrlKey && e.keyCode == 85)) return false;
};
