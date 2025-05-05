import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import country from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json" assert { type: "json" };
const app = express();
const port = 3000;
country.registerLocale(enLocale)
// console.log(enLocale);

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "practice_db",
  password: "root123",
  port: 5432,
});
// 'JP','RU','CA'
db.connect();
let countries=[]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("Select country_code from visited_countries");
  result.rows.map((country) => {
    if(!countries.includes(country.country_code.trim(' '))){
      countries.push(country.country_code.trim(' '));
    }
  });
  console.log(countries);
  //  db.end()
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
});

app.post("/add", async (req, res) => {
  console.log(
    req.body.country,
    ":",
    country.getSimpleAlpha2Code(req.body.country, "en")
  );
  const code=country.getSimpleAlpha2Code(req.body.country,"en")
  console.log(code,':',code!==undefined);
  if(code!==undefined && !countries.includes(code.trim())){
    console.log(code,':',typeof(code));
    
    await db.query(
      `INSERT INTO visited_countries (country_code) VALUES ($1)`,
      [code.toUpperCase().toString()]
    );
    res.status(201).redirect("/");
  }
  else{
    if(code==undefined){
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: 'Country does not exist, Try Agian!'
      });
    }
    else if (countries.includes(code.trim())){
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: 'Country is already been added, Add Diffrent!'
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
