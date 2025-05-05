import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import country from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json" assert { type: "json" };
const app = express();
const port = 3000;
country.registerLocale(enLocale);

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "practice_db",
  password: "root123",
  port: 5432,
});
// 'JP','RU','CA'
db.connect();
let defaultuserId = 1;
let users = [];
let error;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function visited_countries() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1; ",
    [defaultuserId]
  );

  let countries = [];
  result.rows.map((cc) => {
    countries.push(cc.country_code);
  });

  return countries;
}

async function currentUser() {
  const result = await db.query("Select * from users");
  users = result.rows;
  return users.find((user) => user.id == defaultuserId);
}

app.get("/", async (req, res) => {
  const countries = await visited_countries();
  const currentuser = await currentUser();
console.log('im here');

  res.render("index.ejs", {
    countries: countries,
    users: users,
    color: currentuser.color,
    total: countries.length,
    user_id: currentuser.id,
    error: error,
  });
});

app.post("/user", async (req, res) => {
  console.log(req.body);
  
  if (req.body.add == "new") {
    res.render('new.ejs')
    
  }
  else{
    defaultuserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/confirm-del", async (req,res)=>{
  const result = await db.query(`Select * from users where id=$1`,[req.body.user_id]);
  console.log(result.rows);
  
  res.render('del.ejs', {name:result.rows[0].name, id:result.rows[0].id, color: result.rows[0].color})
})

app.post("/add", async (req, res) => {
  
  
  const country_code = country.getAlpha2Code(req.body.country, "en");

  if (country_code !== undefined) {
    error = "";
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [country_code, req.body.user_id]
      );
    } catch (err) {
      // Check if it was a unique violation
      if (err.code === "23505") {
        // 23505 = unique_violation in Postgres
        error = `${req.body.country} has already been added.`;
      } else {
        // Some other DB error
        error = "Something went wrong while adding the country.";
        console.error(err); // Optional: log full error
      }
    }
  } else if (country_code == undefined) {
    error = `${req.body.country} is not a valid country name`;
  }

  res.redirect("/");
});

app.post('/new', async(req,res)=>{
  await db.query("INSERT INTO users (name, color) VALUES ($1, $2)", [req.body.name,req.body.color])

  res.redirect('/')
  
})

app.post('/del', async (req,res)=>{
  console.log(req.body,'kk');

  await db.query("DELETE FROM visited_countries WHERE user_id = $1",[req.body.user_id])
  await db.query("DELETE FROM users WHERE id = $1",[req.body.user_id])
  defaultuserId=1
  res.redirect('/')
})





app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
