import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Sakshi#07", 
  port: 5432,
});
db.connect();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get all posts
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts ORDER BY id DESC");
    res.render("index.ejs", { posts: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new post
app.post('/create-post', async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [title, content]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Edit a post (render edit form)
app.get('/edit-post/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (result.rows.length === 0) {
      return res.status(404).send('Post not found');
    }
    res.render("edit.ejs", { post: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update a post
app.post('/update-post/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  try {
    const result = await db.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      [title, content, postId]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Post not found');
    }
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a post
app.post('/delete-post/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const result = await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    if (result.rowCount === 0) {
      return res.status(404).send('Post not found');
    }
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
