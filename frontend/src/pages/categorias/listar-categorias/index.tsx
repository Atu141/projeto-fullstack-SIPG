import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function ListarCategorias() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Página de Listagem de Categorias
      </Typography>

      <Typography variant="body1">
        {/* Estrutura da tabela */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
              </TableRow>
            </TableHead>
            <TableCell>1</TableCell>
            <TableCell>Eletrônicoos</TableCell>
          </Table>
        </TableContainer>
      </Typography>
    </Box>
  );
}
