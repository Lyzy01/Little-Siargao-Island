const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('.')); // Serves your index.html and style.css

const PLACE_ID = "137436516523280";

app.get('/api/stats', async (req, res) => {
    try {
        // 1. Get Universe ID
        const univRes = await axios.get(`https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);
        const universeId = univRes.data.universeId;

        // 2. Get All Stats
        const [game, favs, votes] = await Promise.all([
            axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
            axios.get(`https://games.roblox.com/v1/games/${universeId}/favorites/count`),
            axios.get(`https://games.roblox.com/v1/games/${universeId}/votes`)
        ]);

        const gameData = game.data.data[0];
        const rating = Math.round((votes.data.upVotes / (votes.data.upVotes + votes.data.downVotes)) * 100) || 0;

        res.json({
            name: gameData.name,
            creator: gameData.creator.name,
            playing: gameData.playing.toLocaleString(),
            visits: gameData.visits.toLocaleString(),
            favorites: favs.data.favoritesCount.toLocaleString(),
            rating: rating + "%",
            icon: `https://www.roblox.com/asset-thumbnail/image?assetId=${PLACE_ID}&width=150&height=150&format=png`,
            thumb: `https://www.roblox.com/asset-thumbnail/image?assetId=${PLACE_ID}&width=768&height=432&format=png`
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch Roblox data" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
