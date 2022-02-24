const express = require('express')
const server = express();

server.all('/', (req, res)=>{
    res.send(`I am ready.`)
})
function keepAlive(){
    server.listen(2000, ()=>{console.log("I am good now")});
}
module.exports = keepAlive;