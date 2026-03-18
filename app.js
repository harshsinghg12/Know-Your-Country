import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));


app.get("/", async (req, res) => {
    try {
        const countries = ["india","china","japan"];
        const countriesinfo = {};
        for (const index in countries) {
            const country = countries[index];
            const response = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
            const result = response.data;

            const currency = result[0].currencies[Object.keys(result[0].currencies)[0]].name;
            countriesinfo[country] = {
                name: result[0].name.common,
                flagURL: result[0].flags.png,
                capital: result[0].capital,
                region: result[0].region,
                currency,
            }
        }
        //console.log(countriesinfo);
        res.render("index.ejs", {countriesinfo});
    } catch (error) {
        console.error(error);
        res.status(500);
    }
})


app.post("/submit", async (req, res) => {
    try {
        const country = req.body.search.trim().replace(/^\s+|\s+$/g, "").toLowerCase();
        const response = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
        const result = response.data;
        const currency = result[0].currencies[Object.keys(result[0].currencies)[0]].name;
        res.render("index.ejs", {
            name: result[0].name.common,
            flagURL: result[0].flags.png,
            capital: result[0].capital,
            region: result[0].region,
            currency
        });
    } catch (error) {
        res.render("index.ejs");
        console.error(error.message);
        res.status(error.status);
    }
})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})