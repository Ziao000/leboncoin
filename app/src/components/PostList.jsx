import { Box, Button, Grid, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/posts/${id}`, {
      method: "DELETE",
    }).then(() => {
      setPosts(posts.filter((post) => post._id !== id));
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <style>
        {`
          .post-card {
            border: 1px solid #ccc;
            padding: 16px;
          }

          .post-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            margin-bottom: 16px;
          }
        `}
      </style>
      <h1>Posts</h1>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearch}
      />
      <Grid container spacing={2}>
        {filteredPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <div className="post-card">
              <img src={post.uploadFiles[0]?.Location} alt={post.title} />
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/posts/${post._id}`}
              >
                View Post
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;
