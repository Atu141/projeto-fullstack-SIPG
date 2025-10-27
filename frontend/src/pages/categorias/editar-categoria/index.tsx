/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CategoriaDTO } from "../../../models/categoria";
import { findById, update } from "../../../services/categoria-service";
import axios from "axios";

type FormData = {
  nome: string;
};

export default function EditarCategoria() {
  const { categoriaId } = useParams();

  const [categoria, setCategoria] = useState<CategoriaDTO>();

  const [formData, setFormData] = useState<FormData>({ nome: "" });

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategoriaData() {
      if (categoriaId) {
        try {
          const data = await findById(Number(categoriaId));
          setCategoria(data);
          setFormData({ nome: data.nome });
        } catch (error: unknown) {
          let msg = "Erro ao carregar Categoria!";
          if (axios.isAxiosError(error) && error.response) {
            msg = error.response.data.error || msg;
          }
          setError(msg);
          setTimeout(() => setError(null), 4000);
          // redireciona o usuário
          navigate("/categorias");
        }
      }
    }

    fetchCategoriaData();
  }, [categoriaId, navigate]);

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Impede o recarregamento da página
    try {
      const requestBody = {
        nome: formData.nome,
      } as CategoriaDTO;

      if (categoriaId) {
        requestBody.id = Number(categoriaId);
      }
      await update(requestBody);
      setSuccess("Categoria atualizada com sucesso!");
      setTimeout(() => navigate("/categorias"), 3000);
    } catch (error: unknown) {
      let msg = "Erro ao salvar categoria. Tente novamente";
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dados inválidos: ${errorMessages}. Tente novamente.`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  }

  return (
    <Box sx={{ mt: 2, p: 4 }}>
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
      <Typography variant="h4" component="h1">
        Editar de Categoria
      </Typography>
      <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSubmit}>
        <TextField
          id="nome"
          name="nome"
          label="Nome da Categoria"
          value={formData.nome}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/categorias")}
          >
            Cancelar
          </Button>
          <Button variant="outlined" color="primary" type="submit">
            Salvar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
