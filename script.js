const PLACE_ID = "137436516523280"; 
const PROXY = "https://corsproxy.io/?url="; // Added 'url=' for better proxy compatibility

async function init() {
    try {
        const resId = await fetch(`${PROXY}https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);
        if (!resId.ok) throw new Error("Proxy error");
        
        const idData = await resId.json();
        const universeId = idData.universeId;

        document.getElementById('gameIcon').src = `https://www.roblox.com/asset-thumbnail/image?assetId=${PLACE_ID}&width=150&height=150&format=png`;
        document.getElementById('thumb').src = `https://www.roblox.com/asset-thumbnail/image?assetId=${PLACE_ID}&width=768&height=432&format=png`;

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
    } catch (e) { 
        console.log("Data fetch failed. Using static display.");
        document.getElementById('title').innerText = "Little Siargao Island";
    }
}

init();

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: 'unnHxxwN9IQ',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'unnHxxwN9IQ', 'mute': 1 },
        events: { 'onReady': (e) => {
            const unlock = () => {
                player.unMute();
                player.playVideo();
                window.removeEventListener('click', unlock);
            };
            window.addEventListener('click', unlock);
            document.getElementById('vol').oninput = (el) => player.setVolume(el.target.value);
        }}
    });
}
