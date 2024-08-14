import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let posts = [];

app.get('/', (req, res) => {
  res.render('index', { posts: posts });
});

app.post('/create-post', (req, res) => {
  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  res.redirect('/');
});

app.get('/edit-post/:id', (req, res) => {
  const post = posts.find(post => post.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('edit', { post: post });
});

app.post('/update-post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) {
    return res.status(404).send('Post not found');
  }
  posts[postIndex] = {
    id: postId,
    title: req.body.title,
    content: req.body.content,
  };
  res.redirect('/');
});

app.post('/delete-post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== postId);
  res.redirect('/');
});




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
