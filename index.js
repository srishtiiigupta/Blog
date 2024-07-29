import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


let posts = [];

// Route to render the home page
app.get('/', (req, res) => {
    res.render('index', { posts: posts });
});

// Route to handle new post submission
app.post('/posts', (req, res) => {
    const post = req.body.post;
    posts.push(post);
    res.redirect('/');
});

// Route to render the edit form
app.get('/posts/edit/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];
    res.render('edit', { post: post, postId: postId });
});

// Route to handle post update
app.post('/posts/edit/:id', (req, res) => {
    const postId = req.params.id;
    posts[postId] = req.body.post;
    res.redirect('/');
});

// Route to handle post deletion
app.post('/posts/delete/:id', (req, res) => {
    const postId = req.params.id;
    posts.splice(postId, 1);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });


