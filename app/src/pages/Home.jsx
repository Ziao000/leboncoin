import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PostList from "../components/PostList";

const Home = () => {
    const navigate = useNavigate();
    return ( 
        <Box>
            <Button
                variant="contained"
                sx={{mb: 4}}
                onClick={() => navigate("/posts/create")}
            >
                Create new posts
            </Button>

            <Typography
                variant="h2"
                sx={{mb: 2}}
            >
                Liste des posts
            </Typography>
            <PostList />
        </Box>
     );
}
 
export default Home;