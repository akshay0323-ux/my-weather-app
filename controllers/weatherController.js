const History = require('../models/History');

// Logic for the homepage
exports.getHomepage = async (req, res) => {
    try {
        const recentSearches = await History.find().sort({ searchedAt: -1 }).limit(5);
        let historyHTML = '';
        if (recentSearches.length === 0) {
            historyHTML = '<p style="color: #999;">No recent searches yet!</p>';
        } else {
            recentSearches.forEach(item => {
                historyHTML += `<li style="margin: 5px 0;"><a href="/weather/${item.cityName}" style="color: #007BFF;">${item.cityName.toUpperCase()}</a></li>`;
            });
        }

        res.send(`
            <main style="font-family: sans-serif; text-align: center; margin-top: 80px;">
                <h1 style="color: #333;">☁️ Global Weather Finder</h1>
                <form onsubmit="event.preventDefault(); window.location.href='/weather/' + document.getElementById('cityInput').value">
                    <input id="cityInput" type="text" placeholder="e.g., Tokyo, London" required style="padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; width: 250px;">
                    <button type="submit" style="padding: 10px 20px; font-size: 16px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">Search</button>
                </form>
                <div style="margin-top: 40px; text-align: left; display: inline-block; width: 300px; background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
                    <h3 style="margin-top: 0; color: #444;">📜 Recent Searches:</h3>
                    <ul style="padding-left: 20px;">${historyHTML}</ul>
                </div>
            </main>
        `);
    } catch (error) {
        res.status(500).send("Error loading homepage.");
    }
};

// Logic for fetching the weather
exports.getWeather = async (req, res) => {
    const city = req.params.city.toLowerCase();
    try {
        const newSearch = new History({ cityName: city });
        await newSearch.save(); 

        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        const data = await response.json();
        const temp = data.current_condition[0].temp_C;
        const condition = data.current_condition[0].weatherDesc[0].value;
        
        res.send(`
            <main style="font-family: sans-serif; text-align: center; margin-top: 80px;">
                <h1>Weather in ${city.toUpperCase()}</h1>
                <p style="font-size: 3rem; margin: 10px 0;">Local Temp: <b>${temp}°C</b></p>
                <p style="font-size: 1.5rem; color: #555;">Condition: ${condition}</p>
                <br><a href="/" style="color: #007BFF; text-decoration: none; font-size: 1.1rem;">← Search Another City</a>
            </main>
        `);
    } catch (error) {
        res.status(500).send(`<h1>Oops! Couldn't find "${city}".</h1><a href="/">Go Back Home</a>`);
    }
};