/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { save } from "../../../services/categoria-service";
import axios from "axios";

type FormData = {
  nome: string;
};

export default function FormularioNovaCategoria() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({ nome: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const name = event.target.name;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmi(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await save(formData);
      setSuccess("Categoria salva com sucesso");
      setFormData({ nome: "" });
      setTimeout(() => navigate("/categorias"), 4000);
    } catch (error: unknown) {
      let msg = "Erro ao salvar categoria. Tente novamente";
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.erros &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.erros
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dadps Invalidos: ${errorMessages}. Tente novamente`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(()=> setError(null), 4000);
    }finally{
        setLoading(false)
    }
  }
  return (
    <Box sx={{ mt: 2, p: 4 }}>
        {success && (
            <Alert severity="success" sx={{mb:2}}>
                {success}
            </Alert>
        )}
        {error && (
            <Alert severity="error" sx={{mb:2}}>
                {error}
            </Alert>
        )}

      <Typography variant="h4" component="h1">
        Cadastro de Categoria
      </Typography>
      <Box
       component="form"
       onSubmit={handleSubmi}
       sx={{ 
        mt: 2,
        "& .MuiTextField-root": {m: 1, width: "100%"}
        }}
       noValidate
       autoComplete="off" >
        <TextField
          required
          id="nome"
          name="nome"
          label="Nome da categoria"
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
             style={{textDecoration: "none", color: "inherit"}}
            >Cancelar</Link>
          </Button>
          <Button    
             type="submit"
             variant="contained"
             disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit"/> : "Salvar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
