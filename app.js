//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//DATABASE//

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////////All Articles///////////////////////////////////

app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then((newArticle) => {
        res.send("Successfully added a new article");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then((result) => {
        res.send("Successfully deleted all articles");
      })
      .catch((err) => {
        res.send(err);
      });
  });

  ////////////////////////////////////////Specific Article///////////////////////////////////
  
  app.route('/articles/:articleTitle')
  .get((req,res)=>{
    Article.findOne({title: req.params.articleTitle})
    .then((foundArticle)=>{
      res.send(foundArticle);
    })
    .catch((err)=>{
      res.send(err);
    })
  })
  .put((req,res)=>{
    Article.updateMany(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {upsert:true} //used for overwrite
      )
      .then((result)=>{
        res.send("Successfully updated article");
      })
      .catch((err)=>{
        res.send(err);
      })
  })
  .patch((req,res)=>{ //Used to update only the fields for which data is given
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set : req.body}
    )
    .then((result)=>{
      res.send("Successfully updated article");
    })
    .catch((err)=>{
      res.send(err);
    })
  })
  .delete((req,res)=>{
    Article.deleteOne({title: req.params.articleTitle})
    .then((result)=>{
      res.send("Successfully deleted article");
    })
    .catch((err)=>{
      res.send(err);
    })
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
