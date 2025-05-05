const fs = require("fs");

// fs.writeFile("message.txt", "hello from this guy name aniruddha", (e)=>{
//     if (e) throw e
//     console.log("The file saved sucessfuly");
    
// })

fs.readFile("./message.txt", "utf8", (e, d)=>{
    if (e) throw e
    console.log(d);
    
})
