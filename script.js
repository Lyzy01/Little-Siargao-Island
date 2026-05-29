// Music Setup
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', 
        width: '0', 
        videoId: 'unnHxxwN9IQ',
        playerVars: { 
            'autoplay': 1, 
            'loop': 1, 
            'playlist': 'unnHxxwN9IQ', // Required for looping
            'controls': 0,
            'mute': 1 // Must start muted to bypass autoplay blocks
        },
        events: { 
            'onReady': (event) => {
                // This function runs when the user clicks anywhere on the screen
                const enableAudio = () => {
                    if (player && typeof player.unMute === 'function') {
                        player.unMute();
                        player.setVolume(50);
                        player.playVideo();
                        console.log("Music Started");
                        // Remove the listener so it doesn't trigger on every click
                        window.removeEventListener('click', enableAudio);
                    }
                };
                window.addEventListener('click', enableAudio);
                
                // Volume slider logic
                const volSlider = document.getElementById('vol');
                if(volSlider) {
                    volSlider.oninput = (e) => player.setVolume(e.target.value);
                }
            },
            'onStateChange': (event) => {
                // If the video ends, loop it manually just in case
                if (event.data === YT.PlayerState.ENDED) {
                    player.playVideo();
                }
            }
        }
    });
}
