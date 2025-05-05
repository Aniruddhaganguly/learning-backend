import express from 'express'

const app = express()

const port =3000

app.use(express.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.render('index.ejs')
})

app.post('/post', (req,res)=>{
    res.render('index.ejs', {data:req.body.postdata})
})


app.post('/update', (req,res)=>{
    res.render('index.ejs', {data:req.body.updatedData})
})

app.post('/delete', (req,res)=>{
    let confirmDelete = req.body.confirmDelete==='true'

    if(confirmDelete){
    res.render('index.ejs', {data:''})

    }
})  

app.listen(port, ()=>{
    console.log(`Listening on ${port}`);
    
})