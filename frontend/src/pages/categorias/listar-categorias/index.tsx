/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import type { CategoriaDTO } from "../../../models/categoria";

import * as categoriaService from "../../../services/categoria-service";
import axios from "axios";
import { Link } from "react-router-dom";

import { Delete, Edit } from "@mui/icons-material";

export default function ListarCategorias() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [succes, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriaService.findAll();
        setCategorias(data);
      } catch (error: unknown) {
        let msg = "Erro ao carregar Categorias";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(`Tem certeza que deseja excuir a Categoria ID: ${id}?`))
      try {
        await categoriaService.deleteById(id);
        setCategorias(categorias.filter((categoria) => categoria.id !== id));
        setSuccess("Categoria excluida com sucesso");
        setTimeout(() => setSuccess(null), 3000);
      } catch (error: unknown) {
        let msg = "Erro ao excluir Categoria";

        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }

        setSuccess(null);
        setError(msg);
        setTimeout(() => setError(null), 4000);
      }
  };

  return (
    <Box sx={{ p: 4 }}>
      {succes && (
        <Alert severity="success" sx={{mb : 2}}>
          {succes}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{mb : 2}}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" component="h1" gutterBottom>
        Listagem de Categorias
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        !error && (
          <Typography variant="body1">
            {/* Estrutura da tabela */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorias.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell>{categoria.id}</TableCell>
                      <TableCell>{categoria.nome}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="editar"
                          component={Link}
                          to={`/categorias/${categoria.id}/editar`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          aria-label="excluir"
                          onClick={() => handleDelete(categoria.id)}
                          sx={{ ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        )
      )}
    </Box>
  );
}
