import express from 'express'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import bodyParser from 'body-parser'
const __dirname=dirname(fileURLToPath(import.meta.url))

const app = express();
const port = 3000;
let bandname
app.use(bodyParser.urlencoded({extended:true}))

function bandnamegen(req, res, next){
    bandname=req.body.street+" "+req.body.pet
    next()
}

app.use(bandnamegen)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit",(req, res,next)=>{
    res.send(`<h1> Band Name is</h1><h4> ${bandname}</h4>`)
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});