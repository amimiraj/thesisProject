const express = require('express');
const cors = require('cors');
const app = express();



app.use(cors({
    origin: 'http://127.0.0.1:3000',
}))

// app.get('/', (req, res) => {
//     res.send('Welcome to CORS server 😁')
// })



app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.send({ "msg": "This has CORS enabled 🎈" })
    })


app.listen(8080, () => {
    console.log('listening on port 8080')
})