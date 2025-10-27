
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { LojaDTO } from "../../../models/loja";
import type { CategoriaDTO } from "../../../models/categoria";

import * as categoriaService from "../../../services/categoria-service";
import * as lojasService from "../../../services/loja-service";
import * as produtoService from "../../../services/produto-service";
import axios from "axios";
import { formatToBRL, unmaskCurrency } from "../../../utils/formatter";
import type { ProdutoCreateDTO } from "../../../models/produto";


type FormData = {
  nome: string;
  descricao: string;
  valor: number | ""; 
  categoriaId: number | "";
  lojasId: number[]; 
};

type FormErrors = {
  nome: string | null;
  descricao: string | null;
  valor: string | null;
  categoriaId: string | null;
  lojasId: string | null;
};

export default function NovoProdutoForm() {
  
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    descricao: "",
    valor: "",
    categoriaId: "",
    lojasId: [],
  });

  
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [lojas, setLojas] = useState<LojaDTO[]>([]);

 
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

 
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: null,
    descricao: null,
    valor: null,
    categoriaId: null,
    lojasId: null,
  });


  const [rawValor, setRawValor] = useState<string>(
    formData.valor ? String(formData.valor) : ""
  );



  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;

   
    if (name === "valor") {
      const rawInput = value.replace(/[^\d,.]/g, "");
      setRawValor(rawInput);
      return;
    }
    
    else if (name === "categoriaId") {
      const selectValue = value === "" ? "" : Number(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectValue,
      }));
    }
    
    else if (name === "lojasId") {
      let newLojasId: number[] = [];
      const selectedValues = Array.isArray(value) ? value : [value];

      newLojasId = selectedValues
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));
      setFormData((prevData) => ({
        ...prevData,
        [name]: newLojasId,
      }));
    }
    
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBlurValor = () => {
    
    const valorDigitado = rawValor;

    if (!valorDigitado) {
      setRawValor("");
      setFormData((prevData) => ({ ...prevData, valor: "" }));
      return;
    }
    const numericValue = unmaskCurrency(valorDigitado);

    const finalValue = numericValue === 0 ? "" : numericValue;

    let stringFormatada: string;
    if (finalValue !== "") {
      stringFormatada = formatToBRL(finalValue);
    } else {
      stringFormatada = "";
    }
    setRawValor(stringFormatada);
    setFormData((prevData) => ({
      ...prevData,
      valor: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    setError(null);
    setSuccess(null);
    setIsSubmitting(true); 

    
    setFormErrors({
      nome: null,
      descricao: null,
      valor: null,
      categoriaId: null,
      lojasId: null,
    });

    try {
      const dataToSend = { ...formData };
      
      const validationErrors: Partial<FormErrors> = {};
      let hasFrontendError = false;
     
      const nomeTrim = dataToSend.nome.trim();
      const descricaoTrim = dataToSend.descricao.trim();



      if (nomeTrim.length === 0) {
        validationErrors.nome = "O campo Nome é obrigatório";
        hasFrontendError = true;
      } else if (nomeTrim.length < 3 || nomeTrim.length > 100) {
        validationErrors.nome =
          "O campo Nome deve ter entre 3 e 100 caracteres";
        hasFrontendError = true;
      }

    
      if (descricaoTrim.length === 0) {
        validationErrors.descricao = "O campo Descrição é obrigatório";
        hasFrontendError = true;
      } else if (descricaoTrim.length < 10) {
        validationErrors.descricao =
          "O campo Descrição deve ter no mínimo 10 caracteres";
        hasFrontendError = true;
      }

  
      const valorNumber = Number(dataToSend.valor);
      if (dataToSend.valor === "" || isNaN(valorNumber)) {
        validationErrors.valor =
          "O campo Valor é obrigatório e deve ser um número.";
        hasFrontendError = true;
      } else if (valorNumber <= 0) {
        validationErrors.valor =
          "O campo Valor deve ser um número positivo maior que zero.";
        hasFrontendError = true;
      }

    
      if (dataToSend.categoriaId === "") {
        validationErrors.categoriaId = "Selecione uma Categoria";
        hasFrontendError = true;
      }

  
      if (dataToSend.lojasId.length === 0) {
        validationErrors.lojasId = "Selecione pelo menos uma Loja";
        hasFrontendError = true;
      }

      
      if (hasFrontendError) {
        setFormErrors((prev) => ({
          ...prev,
          ...validationErrors,
        }));
        
        setIsSubmitting(false);
        return; 
      }

    
      const categoriaDTO = { id: Number(dataToSend.categoriaId) };
      const lojasDTO = dataToSend.lojasId.map((id) => ({ id: Number(id) }));

      const createDTO: ProdutoCreateDTO = {
        nome: nomeTrim,
        descricao: descricaoTrim,
        valor: valorNumber,
        categoria: categoriaDTO,
        lojas: lojasDTO,
      };

    
      await produtoService.createProduto(createDTO);

     
      setSuccess("Produto cadastrado com sucesso!");

      
      setFormData({
        nome: "",
        descricao: "",
        valor: "",
        categoriaId: "",
        lojasId: [],
      });
      setRawValor("");

      setTimeout(() => {
        navigate("/produtos");
      }, 3000);
    } catch (error: unknown) {
     
      let msg = "Erro ao cadastrar o Produto. Tente novamente.";

      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;

        
        if (
          errorData.status === 422 &&
          errorData.errors &&
          Array.isArray(errorData.errors)
        ) {
          const newErrors: Partial<FormErrors> = {};
          errorData.errors.forEach(
            (err: { field: string; message: string }) => {
              let fieldName = err.field;
              
              if (fieldName.includes("categoria")) {
                fieldName = "categoriaId";
              } else if (fieldName.includes("lojas")) {
                fieldName = "lojasId";
              }

              newErrors[fieldName as keyof FormErrors] = err.message;
              msg = errorData.message || msg;
            }
          );
          setFormErrors((prev) => ({
            ...prev,
            ...newErrors,
          }));
        } else {
         
          msg = errorData.message || errorData.error || msg;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }

      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {

      setIsSubmitting(false);
    }
  };

  
  useEffect(() => {
    
    const loadDependenciesList = async () => {
      setIsLoading(true); 
      setError(null);

      try {
       
        const [categoriaData, lojasData] = await Promise.all([
          categoriaService.findAll(),
          lojasService.findAll(),
        ]);

        setCategorias(categoriaData);
        setLojas(lojasData);
      } catch (error: unknown) {
        let msg = "Erro ao carregar listas de Categorias e Lojas";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
       
        setError(msg);
        setTimeout(() => {
          navigate("/produtos", {
            
            state: { globalError: msg },
          });
        }, 3000);
      } finally {
        setIsLoading(false); 
      }
    };

    
    loadDependenciesList();
  }, [navigate]);

  
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
        Cadastrar Produto
      </Typography>

      
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        
        !error && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* 1. CAMPO NOME*/}
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome do Produto"
              name="nome"
              autoFocus
              value={formData.nome}
              onChange={handleChange}
              
              onBlur={() => {
                const nomeAtual = formData.nome;
                const nomeTrimado = nomeAtual.trim();
                if (nomeAtual !== nomeTrimado) {
                  setFormData((prevData) => ({
                    ...prevData,
                    nome: nomeTrimado,
                  }));
                }
              }}
              error={!!formErrors.nome}
              helperText={formErrors.nome}
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            />

            {/* 2. CAMPO DESCRIÇÃO */}
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={3}
              id="descricao"
              label="Descrição do Produto"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              onBlur={() => {
                const descricaoAtual = formData.descricao;
                const descricaoTrimado = descricaoAtual.trim();
                if (descricaoAtual !== descricaoTrimado) {
                  setFormData((prevData) => ({
                    ...prevData,
                    descricao: descricaoTrimado,
                  }));
                }
              }}
              error={!!formErrors.descricao}
              helperText={formErrors.descricao}
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            />

            {/* 3. CAMPO VALOR */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="valor"
              label="Valor do Produto"
              name="valor"
              value={rawValor} 
              onChange={handleChange}
              onBlur={handleBlurValor}
              error={!!formErrors.valor}
              helperText={formErrors.valor}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* 4. Select para Categoria */}
            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{ mb: 2 }}
              error={!!formErrors.categoriaId}
              disabled={isSubmitting}
            >
              <InputLabel id="categoria-label">Categoria</InputLabel>
              <Select
                labelId="categoria-label"
                id="categoriaId"
                name="categoriaId"
                value={
                  formData.categoriaId === ""
                    ? ""
                    : String(formData.categoriaId)
                }
                label="Categoria"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Selecione uma Categoria</em>
                </MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.categoriaId && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ ml: 2, mt: 0.5 }}
                >
                  {formErrors.categoriaId}
                </Typography>
              )}
            </FormControl>

            {/* 5. Multi-Select para Lojas */}
            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{ mb: 2 }}
              error={!!formErrors.lojasId}
              disabled={isSubmitting}
            >
              <InputLabel id="lojas">Lojas</InputLabel>
              <Select
                labelId="lojas"
                id="lojas-multiple-chip"
                multiple
                name="lojasId"
                value={formData.lojasId}
                
                onChange={(event) => handleChange(event as SelectChangeEvent)}
                label="Lojas"
                renderValue={(selectedIds: number[]) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedIds.map((id) => {
                      const loja = lojas.find((l) => l.id === id);
                      return (
                        <Chip key={id} label={loja ? loja.nome : `ID ${id}`} />
                      );
                    })}
                  </Box>
                )}
              >
                {lojas.map((loja) => (
                  <MenuItem key={loja.id} value={loja.id}>
                    {loja.nome}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.lojasId && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ ml: 2, mt: 0.5 }}
                >
                  {formErrors.lojasId}
                </Typography>
              )}
            </FormControl>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/produtos")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : "Salvar"}
              </Button>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
}
