/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  Button,
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
  const [success, setSuccess] = useState<string | null>(null);

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
    if (window.confirm(`Tem certeza que deseja excluir a categoria ID: ${id}`))
      try {
        await categoriaService.deleteById(id);
        setCategorias(categorias.filter((categoria) => categoria.id !== id));
        setSuccess("Categoria excluída com sucesso!");
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Página de Listagem de Categorias
        </Typography>

        <Button variant="contained">
          <Link
            to="/categorias/novo"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Novo
          </Link>
        </Button>
      </Box>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                          to={`/categorias/editar/${categoria.id}`}
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
