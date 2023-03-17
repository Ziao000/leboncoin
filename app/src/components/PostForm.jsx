import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {Typography} from "@mui/material";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


const PostForm = () => {
  const [credentials, setCredentials] = useState({});
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(Array(5).fill(null));
  const [address, setAddress] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [open, setOpen] = useState(false); 


  const handleSelect = (place) => {
    setAddress(place.formatted_address);
  };


  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
    const newSelectedFile = [...selectedFile];
    newSelectedFile[files.length] = URL.createObjectURL(acceptedFiles[0]);
    setSelectedFile(newSelectedFile);
    setIsAdd(true);
    setTimeout(() => {
      setIsAdd(false);
    }, 1500);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", credentials.title);
    formData.append("content", credentials.content);
    formData.append("file", credentials.uploadFiles);
    formData.append("city", credentials.city);

    files.forEach((file) => {
      formData.append("photos", file);
    });

    fetch("http://localhost:8000/api/posts", {
      method: "POST",
      body: formData,
    });

    setIsPost(true);
    setTimeout(() => {
      setIsPost(false);
    }, 1500);

    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      window.location.href = "/";
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

 
  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      
      sx={{
        display: "flex",
        flexDirection: "column",
        ".MuiInputBase-root, .MuiButton-root": {
          mb: 2,
        },
      }}
    >
      <TextField
        label="Title"
        variant="outlined"
        name="title"
        onChange={handleChange}
      />
      <TextField
        label="Content"
        variant="outlined"
        name="content"
        onChange={handleChange}
        multiline
        rows={4}
      />
  

      <Box
        {...getRootProps()}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(1, 100px)",
          gap: 2,
          mb: 2,
        }}
      >

        {[...Array(5)].map((_, index) => {
          const file = files[index];
          return (
            <Box
              key={index}
              sx={{
                border: "1px dashed gray",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1rem",
                color: "gray",
                cursor: "pointer",
                position: "relative",
                backgroundImage:
                  selectedFile[index] && `url(${selectedFile[index]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Relâcher pour ajouter une photo</p>
                ) : (
                  <p>Ajouter une photo</p>
                )}
              </Box>
              

              {files[index] && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  {files[index].name}
                </Box>
              )}
            </Box>
          );
        })}   
      </Box>
      <div>
      <GooglePlacesAutocomplete
        apiKey="AIzaSyDfCTDAbYxeVFwoB_ixTiMQDLu33uYMz6g"
        autocompletionRequest={{
          componentRestrictions: { country: "fr" },
        }}
        selectProps={{
          value: null,
          onChange: handleSelect,
          placeholder: "Entrez une adresse",
        }}
      />
    </div>

    <br></br>
    <Button
      variant="contained"
      color="primary"
      type="submit"
    >
      {isPosting ? "Posting..." : "Post"}
    </Button>
      <Snackbar
        open={isAdd}
        message="L'image a bien été ajouté"
        autoHideDuration={5000}
      />
      <Snackbar
        open={isPost}
        autoHideDuration={5000}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
        L'annonce a bien été ajouté
        </Alert>
        </Snackbar>

        <Snackbar
        open={open}
        autoHideDuration={5000}
      >
      <Alert severity="success" sx={{ width: '100%' }}>
        L'annonce a bien été ajouté
        </Alert>
        </Snackbar>
    </Box>   
    
    );
};
  
  export default PostForm;
