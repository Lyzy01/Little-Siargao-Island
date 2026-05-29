const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('.'));

const PLACE_ID = "137436516523280";

app.get('/api/stats', async (req, res) => {
    try {
        const univRes = await axios.get(`https://apis.roproxy.com/universes/v1/places/${PLACE_ID}/universe`);
        const universeId = univRes.data.universeId;

        const [game, favs, votes, iconRes, thumbRes] = await Promise.all([
            axios.get(`https://games.roproxy.com/v1/games?universeIds=${universeId}`),
            axios.get(`https://games.roproxy.com/v1/games/${universeId}/favorites/count`),
            axios.get(`https://games.roproxy.com/v1/games/${universeId}/votes`),
            axios.get(`https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=${PLACE_ID}&size=150x150&format=Png&isCircular=false`),
            axios.get(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&defaults=true&size=768x432&format=Png`)
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
            icon: iconRes.data.data[0].imageUrl,
            thumb: thumbRes.data.data[0].thumbnails[0].imageUrl
        });
    } catch (err) {
        res.status(500).json({ error: "API Error" });
    }
});

app.listen(PORT, () => console.log(`Server running`));
