import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";

const PostPageForm = () => {
    const navigate = useNavigate();

    return ( 
        <Box>
            <Button
                variant="outlined"
                // LinkComponent={Link}
                // component={Link}
                // to="/"
                sx={{mb: 4}}
                onClick={() => navigate("/")}
            >
                Go back
            </Button>

            <Typography
                variant="h2"
                sx={{mb: 2}}
            >
                Create a new post
            </Typography>

            <PostForm />
        </Box>
     );
}
 
export default PostPageForm;