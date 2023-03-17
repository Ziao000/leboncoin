import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostPageForm from './pages/PostPageForm';
import PostPage from './pages/PostPage';

function App() {
  return (
    <Container sx={{pt: 5}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/create" element={<PostPageForm />} />
          <Route path="/posts/:id" element={<PostPage/>} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
