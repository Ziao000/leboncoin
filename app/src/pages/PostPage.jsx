import { Box, Button, Grid, Input, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  const handleDelete = () => {
    fetch(`http://localhost:8000/api/posts/${id}`, {
      method: "DELETE",
    }).then(() => {
      setIsDeleted(true);
      setTimeout(() => {
        setIsDeleted(false);
        window.location.href = "/"; 
      }, 500);
    });
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setNewTitle(post.title);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleTitleSave = () => {
    // Envoyer la nouvelle valeur du titre au back-end
    fetch(`http://localhost:8000/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    }).then(() => {
      // Mettre à jour l'état local du post avec le nouveau titre
      setPost((prevState) => ({
        ...prevState,
        title: newTitle,
      }));
      setIsEditingTitle(false);
    });
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  let imgSize;
  if (post.uploadFiles.length === 1) {
    imgSize = "100%";
  } else {
    imgSize = "70%";
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {isEditingTitle ? (
              <Input value={newTitle} onChange={handleTitleChange} onBlur={handleTitleSave} autoFocus />
            ) : (
              <Typography variant="h3" gutterBottom onClick={handleTitleEdit}>
                {post.title}
              </Typography>
            )}
            {post.uploadFiles.length === 1 && (
              <img src={post.uploadFiles[0].Location} alt={post.title} style={{ width: imgSize, margin: "auto" }} />
            )}
            {post.uploadFiles.length >= 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <img src={post.uploadFiles[0].Location} alt={post.title} style={{ width: imgSize, margin: "auto" }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  {post.uploadFiles.slice(1, 3).map((file) => (
                    <img key={file._id} src={file.Location} alt={post.title} style={{ width: "100%" }} />
                  ))}
                </Grid>
              </Grid>
            )}
            <Typography variant="body1" gutterBottom>
                <h2>Decription de l'annonce :</h2>
              {post.content}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="contained" color="error" sx={{ width: "100%", mb: 2 }} onClick={handleDelete}>
            Delete
          </Button>
          <Button component={Link} to="/" variant="contained" color="primary" sx={{ width: "100%" }}>
            Back to posts
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={isDeleted}
        message="L'annonce a été supprimée."
        autoHideDuration={5000}
      />
    </Box>
  );
};

export default PostPage;
