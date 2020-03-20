const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const port = 3000 || process.env.PORT;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const articleSchema = mongoose.Schema({
    name: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);


//GET
app.get('/articles', (req, res) => {
    Article.find( (err, foundArticle) => {
        res.send(err || foundArticle);
    });
});


//POST
app.post('/articles', (req, res) => {
   
   const newArticle = new Article({
       name: req.body.title,
       content: req.body.content
   });
   newArticle.save((err) => {
    res.send(err || "Sucessfully Added");
   });
});


//DELETE
app.delete('/articles', (req, res) => {
    Article.deleteMany((err) => {
        res.send(err || "Sucessfully deleted all articles");
    });
});


app.listen(port, () => {
    console.log("Server is running at localhost:" + port);
});
