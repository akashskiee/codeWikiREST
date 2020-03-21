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
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

/////////route for all articles

app.route("/articles")

.get((req, res) => {
    Article.find( (err, foundArticle) => {
        res.send(err || foundArticle);
    });
})

.post( (req, res) => {
   
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
     res.send(err || "Sucessfully Added");
    });
 })

 .delete((req, res) => {
    Article.deleteMany((err) => {
        res.send(err || "Sucessfully deleted all articles");
    });
});

////////////////route for specific article

app.route("/articles/:articleName")
.get((req,res) => {
        Article.findOne({title: req.params.articleName}, (err, specificArticle) => {
            res.send(err || specificArticle);
        });
})

.put((req, res) => {
    Article.update(
        {title: req.params.articleName},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) =>{
            res.send(err || "Sucessfully updated article!");
        }
        );
})

.patch((req, res) => {
    Article.update(
        {title: req.params.articleName},
        {$set: req.body},
        (err) => {
            res.send(err || "Sucessfully updated");
        }
    );
})

.delete((req, res) => {
    Article.deleteOne({title: req.params.articleName},
        (err) => {
            res.send(err || "Sucessfully deleted");
        });
});

app.listen(port, () => {
    console.log("Server is running at localhost:" + port);
});
