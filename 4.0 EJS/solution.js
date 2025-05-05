import express from "express"

const app= express()

const port =3000

const date  = new Date();
let day = date.getDay();
console.log(day);

app.get("/",(req,res)=>{
  if(day==0 || day==6){
    res.render("solution.ejs",{
      dayType: 'a weekend',
      advice: 'lets party hard'
    })
  }
  else{
    res.render("solution.ejs",{
      dayType: 'a weekday',
      advice: 'lets work hard'
    })
  }
})

app.listen(port, ()=>{
  console.log(`listening on ${port}`);
  
})