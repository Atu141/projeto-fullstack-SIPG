import { Box } from "@mui/material";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header title="Hub de Produtos"/>

      <Footer />
    </Box>
  )
}

export default App
