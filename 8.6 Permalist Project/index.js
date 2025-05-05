import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "root123",
  port: 5432,
});

db.connect()

let items = [
 
];


async function getItems() {
 const result= await db.query("Select * from items")
items=result.rows
// console.log(temitem);

}


app.get("/", async (req, res) => {

  await getItems()
// console.log(items,'kk');

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
 await db.query("INSERT INTO items (title) VALUES ($1)",[item])
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const upadteditem = req.body.updatedItemTitle;

  const updatedid= req.body.updatedItemId

 await db.query(
    "update items set title = $1 where id = $2",
    [upadteditem,updatedid]
  )

  res.redirect('/')


});

app.post("/delete", async (req, res) => {
  const id= req.body.deleteItemId
 await db.query("delete from items where id=($1)",[id])
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
