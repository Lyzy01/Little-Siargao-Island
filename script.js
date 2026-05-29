async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        // Set non-numeric text immediately
        document.getElementById('title').innerText = data.name;
        document.getElementById('dev').innerText = `by ${data.creator}`;
        document.getElementById('gameIcon').src = data.icon;
        document.getElementById('thumb').src = data.thumb;
        document.getElementById('rating').innerText = data.rating;

        // Animate the numeric counters
        // We remove commas first to treat them as numbers, then animate
        animateValue("visits", 0, parseInt(data.visits.replace(/,/g, '')), 2000);
        animateValue("playing", 0, parseInt(data.playing.replace(/,/g, '')), 2000);
        animateValue("favs", 0, parseInt(data.favorites.replace(/,/g, '')), 2000);

    } catch (e) { 
        console.error("Counter Animation Error:", e); 
    }
}

// The "YouTube Style" Counter Logic
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Calculate the current number
        const currentVal = Math.floor(progress * (end - start) + start);
        
        // Format with commas and update the HTML
        obj.innerHTML = currentVal.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

updateStats();
