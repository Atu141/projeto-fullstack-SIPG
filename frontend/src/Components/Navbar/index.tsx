import { Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar(){

    return(
        <Box sx={{ flexGrow: 1, display: 'flex'}}>
            <Stack direction='row' spacing={2}>

            <Button color="inherit" component={Link} to="/">
                Início
            </Button>
            <Button color="inherit" component={Link} to="/categorias">
                Categorias
            </Button>
            <Button color="inherit" component={Link} to="/produtos">
                Produtos
            </Button>

            </Stack>

        </Box>

    );
}