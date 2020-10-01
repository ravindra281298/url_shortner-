const express = require("express");
const URI = require('./config/keys').URI;
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

const app = express();
const port = 3000;

mongoose
    .connect(
        URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => { console.log("mongoDB connected successfully")})
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));



app.get('/', async (req,res) => {
    const shortUrls = await shortUrl.find();

    res.render('main', {shortUrls: shortUrls});
});

app.post('/', async (req,res) => {

    await shortUrl.create({full:req.body.fullUrl});

    const shortUrls = await shortUrl.find()

    res.render('main', {shortUrls: shortUrls});
})

app.get('/:shortUrl', async  (req,res) => {

    const shortUrls =  await shortUrl.findOne({short: req.params.shortUrl});

    if(shortUrls == null || shortUrls.full == undefined ) return res.status(404);

    shortUrls.clicks+=1;
    shortUrls.save();
    res.redirect(shortUrls.full);
})




app.listen(port, () => {
    console.log(`Listening at : https://localhost:${port}`);
});