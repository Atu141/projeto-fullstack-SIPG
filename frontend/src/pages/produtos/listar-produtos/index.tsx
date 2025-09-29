import { Box, Typography } from "@mui/material";


export default function ListarProdutos() {

    return(

         <Box sx={{ p: 4}}>
            <Typography variant="h4" component='h1' gutterBottom>
                Página de Listagem de Produtos
            </Typography>

            <Typography variant="body1">
                Aqui será a lista de produtos
            </Typography>
        </Box>

    );
}