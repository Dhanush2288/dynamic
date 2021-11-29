const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => console.log('server started on 3000'))

app.use(express.static(path.join(__dirname,'./dist/dynamic')));

app.get("*",(req,res)=>{
    return res.sendFile(path.join(__dirname,'./dist/dynamic/index.html'));
});
