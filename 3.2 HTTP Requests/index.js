import express from "express";

const app = express();
const port = 3000;

app.get("/", (req,res)=>{
    res.send("<h1>Home</h1>")
})

app.get("/about", (req,res)=>{
    res.send("<p>Hello Im Aniruddha</p>")
})

app.get("/contact", (req,res)=>{
    res.send("<p>Ph No.</p><P>8105366430</p>")
})

app.listen(port, () => {
  console.log(`Im listening on ${port}`);
});
