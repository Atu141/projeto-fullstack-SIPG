/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { save } from "../../../services/categoria-service";

type FormData = {
  nome: string;
};

export default function FormularioNovaCategoria() {
  const [formData, setFormData] = useState<FormData>({ nome: "" });

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const name = event.target.name;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await save(formData);
      setSuccess("Categoria salva com sucesso!");
      setFormData({ nome: "" }); // Limpa o formulário após o sucesso
      setTimeout(() => navigate("/categorias"), 4000);
    } catch (error: unknown) {
      let msg = "Erro ao salvar Categoria. Tente novamente";
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dados inválidos: ${errorMessages}. Tente novamente.`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
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
        Cadastro de Categoria
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 2,
          "& .MuiTextField-root": { m: 1, width: "100%" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="nome"
          name="nome"
          label="Nome da Categoria"
          value={formData.nome}
          onChange={handleChange}
          error={!!error}
          fullWidth
        />

        <Box
          sx={{ my: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button variant="contained" color="secondary">
            <Link
              to="/categorias"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Cancelar
            </Link>
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Salvar"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
