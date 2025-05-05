import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'

const app = express();
const port = 3000;
let isCorrect ;

let quiz = [
  
];

let totalCorrect=0 ;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { 
    question: currentQuestion,
    totalScore: totalCorrect,
    wasCorrect: isCorrect,
 });
});

app.get('/restart', (req,res)=>{
  isCorrect=true
  totalCorrect=0
  res.redirect('/')
})

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  console.log(answer==currentQuestion.capital);
  
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }
  else {
    isCorrect=false
  }

  res.redirect('/')
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

const db = new pg.Client({
  user:'postgres',
  host:'localhost',
  database:'practice_db',
  password:'root123',
  port:5432,
});

db.connect();

db.query("SELECT country, capital from capitals where capital is not null", (err,res)=>{
  if(err){
    console.log(err.stack);
    
  } else {
    quiz=res.rows
    console.log(res.rows);
    
  }
  db.end()
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
