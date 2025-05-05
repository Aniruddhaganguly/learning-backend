import express from "express";

const app = express();
const port = 3000;

function logger (req, res , next){
    console.log("Method used is: ",req.method);
    console.log("URL used is: ",req.url);
    next()
}

app.use(logger);

app.get("/", (req, res) => {
  res.send("How are you? ");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
