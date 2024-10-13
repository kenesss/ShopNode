

const express = require("express");
const mongoose = require("mongoose")
const app = express();

mongoose.connect('mongodb://localhost:27017').then(() => {
  console.log("Connect db");
}).catch((e) => {
  console.log("failed");
})

app.use(express.urlencoded())
const ToDoSchema = new mongoose.Schema({
  name: String,
  price: String,
  sale: String,
  url: String,
})

const ToDo = mongoose.model("shop", ToDoSchema)

app.post('/new' , async(req , res) => {
  if (req.body.name.length != 0) {
    await new ToDo({
      name: req.body.name,
      price: req.body.price,
      sale: req.body.sale,
      url: req.body.url,
    }).save();
    res.redirect("/");
  } else {
    res.redirect("/new?error1");
  }
})

app.post('/edit', async(req , res) => {
  await ToDo.updateOne(
    { _id: req.body.id },
    {
      name: req.body.name,
      price: req.body.price,
      sale: req.body.sale,
      url: req.body.url,
    }
    ),
    res.redirect('/')
})

app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await ToDo.findByIdAndDelete(id);
    res.redirect("/");
});

app.set("view engine", "ejs");

var path = require('path');

app.use(express.static(path.join(__dirname, 'style')))
app.use(express.static(path.join(__dirname, "img")));
app.use(express.static(path.join(__dirname, "js")));

app.get("/", async(req, res) => {
  const data = await ToDo.find()
  res.render("index", {data});
});

app.get("/modern", (req, res) => {
  res.render("modern");
});

app.get("/edit/:id", async(req, res) => {
  const toDoData = await ToDo.findById(req.params.id)
  res.render("edit", {data: toDoData});
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/404", (req, res) => {
  res.render("404");
});

app.use((req, res) => {
  res.status(404)
  res.render("404")
})

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
 



