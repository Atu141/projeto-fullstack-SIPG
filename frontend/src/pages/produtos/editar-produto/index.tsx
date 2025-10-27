/* eslint-disable @typescript-eslint/no-unused-vars */

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type ChangeEvent } from "react";
import { Alert, Box, Button, Chip, CircularProgress, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, type SelectChangeEvent } from "@mui/material";

import * as categoriaService from "../../../services/categoria-service";
import * as produtoService from "../../../services/produto-service";
import * as lojaService from "../../../services/loja-service";
import type { CategoriaDTO } from "../../../models/categoria";
import { formatToBRL, unmaskCurrency } from "../../../utils/formatter";
import axios from "axios";
import type { LojaDTO } from "../../../models/loja";
import type { ProdutoUpdateDTO } from "../../../models/produto";

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

export default function EditarProdutoForm() {
   const { produtoId } = useParams<{ produtoId: string }>();

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

 useEffect(() => {
    setIsLoading(true);
    setError(null);

    const loadFormData = async () => {
      if (!produtoId) {
        setIsLoading(false);
        setError("Nenhum ID de produto fornecido para edição.");
        return;
      }

      try {
        // 1. Buscas Paralelas: Buscar o produto, categorias e lojas ao mesmo tempo
        const [produtoData, categoriasData, lojasData] = await Promise.all([
          produtoService.findById(Number(produtoId)),
          categoriaService.findAll(),
          lojaService.findAll(),
        ]);
        // 2. Definindo os estados
        setCategorias(categoriasData);
        setLojas(lojasData);
        // 3. Preencher o formulário com dados do produto
        setFormData({
          nome: produtoData.nome,
          descricao: produtoData.descricao,
          valor: produtoData.valor,
          categoriaId: produtoData.categoria.id,
          // Mapeia a lista de objetos LojaDTO para uma lista de IDs
          lojasId: produtoData.lojas.map((loja) => loja.id),
        });

        // =======================================================
        // Sincroniza o estado de exibição (string) com o valor do backend (number)
        const valorDoBackend = produtoData.valor;

        // Converte o number do backend para string, tratando valores nulos/vazios
       const valorInicialString = valorDoBackend ? String(formatToBRL(valorDoBackend)) : "";

        // ATUALIZA O ESTADO AUXILIAR que é usado no TextField
        setRawValor(valorInicialString);
        
        // =======================================================
      } catch (error: unknown) {
        let msg = "Erro ao carregar dados do Produto";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setError(msg);
        setTimeout(() => {
          // Redireciona e passa a mensagem de erro no 'state'
          navigate("/produtos", {
            state: { globalError: msg },
          });
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    loadFormData();
  }, [produtoId, navigate]);

  // Function para manipular mudanças no form
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name === "valor") {
      // 1. FILTRO: Permite dígitos, vírgula e ponto para a digitação livre.
      const rawInput = value.replace(/[^\d,.]/g, "");

      // 2. ATUALIZA O ESTADO DE EXIBIÇÃO: Isto garante 
      // que a string digitada (150,5) permaneça.
      setRawValor(rawInput);

      // ADICIONE O RETURN AQUI para garantir que não caia na lógica padrão
      return;
    } else if (name === "categoriaId") {
      // O Select retorna o ID como string.
      // Armazenamos como Number (se houver valor)
      // ou string vazia (para o placeholder).
      const selectValue = value === "" ? "" : Number(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectValue,
      }));
    } else if (name === "lojasId") {
      let newLojasId: number[] = [];
      // O valor (value) pode ser uma string (se for uma única seleção)
      // ou um array (se for multi-select)
      // Para garantir que sempre temos um array
      //  NOTA: O value vem como `unknown` aqui e precisa ser tratado como array.
      const selectedValues = Array.isArray(value) ? value : [value];
      // Mapeando os IDs para números, filtrando valores vazios se houver
      newLojasId = selectedValues
        .map((id) => Number(id))
        .filter((id) => !isNaN(id)); // Garante que só Numbers válidos no array
      setFormData((prevData) => ({
        ...prevData,
        [name]: newLojasId,
      }));
    } else {
      // Para os demais campos de texto (nome, descricao)
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // FUNÇÃO: Chamada ao sair do campo para limpar e salvar o número no formData
  const handleBlurValor = () => {
    // Pega a string crua que o usuário digitou (ex: "150,5")
    const valorDigitado = rawValor;

    if (!valorDigitado) {
      // Se vazio, limpa os dois estados
      setRawValor("");
      setFormData((prevData) => ({ ...prevData, valor: "" }));
      return;
    }

    // 1. Limpa e converte a string para o número final (ex: 150.5)
    // Usa sua função unmaskCurrency:
    const numericValue = unmaskCurrency(valorDigitado);

    // 2. Garante que salvamos o valor numérico final (ou "" se for zero)
    const finalValue = numericValue === 0 ? "" : numericValue;

    // =======================================================
    // 3. Atualiza o estado de exibição (rawValor) com a formatação BRL

    let stringFormatada: string;
    if (finalValue !== "") {
      // Formata o número limpo (150.5) de volta para a string visual ("150,50")
      stringFormatada = formatToBRL(finalValue);
    } else {
      // Limpa o estado de exibição se o valor final for zero ou vazio
      stringFormatada = "";
    }

    // ATUALIZA O ESTADO DE EXIBIÇÃO
    setRawValor(stringFormatada);
    // =======================================================

    // 4. Atualiza o estado PRINCIPAL (o número limpo para envio)
    setFormData((prevData) => ({
      ...prevData,
      valor: finalValue, // finalValue é o number limpo (150.5)
    }));
  };

  // Function para Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Limpeza de Status e Ativação do Loading
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // 2. Limpa todos os erros de campo antes de começar o novo submit
    setFormErrors({
      nome: null,
      descricao: null,
      valor: null,
      categoriaId: null,
      lojasId: null,
    });

    try {
      const dataToSend = { ...formData };
      // Objeto para coletar erros de Frontend
      const validationErrors: Partial<FormErrors> = {};
      let hasFrontendError = false;
      // Limpa espaços em branco para validação de tamanho/vazio
      const nomeTrim = dataToSend.nome.trim();
      const descricaoTrim = dataToSend.descricao.trim();
      // 3. Validações de Frontend
      if (nomeTrim.length === 0) {
        validationErrors.nome = "O campo Nome é obrigatório";
        hasFrontendError = true;
      } else if (nomeTrim.length < 3 || nomeTrim.length > 100) {
        validationErrors.nome =
          "O campo Nome dever ter entre 3 e 100 caracteres";
        hasFrontendError = true;
      }
      if (descricaoTrim.length === 0) {
        validationErrors.descricao = "O campo Descrição é obrigatório";
        hasFrontendError = true;
      } else if (descricaoTrim.length < 10) {
        validationErrors.descricao =
          "O campo Descrição dever ter no mínimo 10 caracteres";
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
      // ------------------------------------------------------------------
      // Se houver qualquer erro de validação de frontend, exibe e interrompe o envio
      if (hasFrontendError) {
        setFormErrors((prev) => ({
          ...prev,
          ...validationErrors,
        }));
        setIsSubmitting(false); // Reabilita o botão imediatamente
        return; // Interrompe o submit aqui!
      }

      // 4. MONTAGEM DO DTO FINAL PARA A API
      const categoriaDTO = { id: Number(dataToSend.categoriaId) };
      // Blindando o ID para garantir que seja NUMBER
      const lojasDTO = dataToSend.lojasId.map((id) => ({ id: Number(id) }));
      const updateDTO: ProdutoUpdateDTO = {
        nome: nomeTrim,
        descricao: descricaoTrim,
        valor: valorNumber,
        categoria: categoriaDTO,
        lojas: lojasDTO,
      };

      // 5. Chamada do Serviço (API)
      if (!produtoId) {
        throw Error("ID do Produto não encontrado para atualização.");
      }

      await produtoService.updateProduto(Number(produtoId), updateDTO);

      // 6. Sucesso
      setSuccess("Produto atualizado com sucesso!");
      setTimeout(() => {
        navigate("/produtos");
      }, 3000);
    } catch (error: unknown) {
      let msg = "Erro ao atualizar o Produto. Tente novamente.";

      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;

        // Tratamento de Erro de Validação de Campo do Backend (Status 422)
        if (
          errorData.status === 422 &&
          errorData.errors &&
          Array.isArray(errorData.errors)
        ) {
          const newErrors: Partial<FormErrors> = {};

          errorData.errors.forEach(
            (err: { field: string; message: string }) => {
              let fieldName = err.field;

              // Mapeamento de campos aninhados do Spring para o estado do Formulário (frontend)
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
          // Tratamento de Erros Gerais (404, 400, etc.)
          msg = errorData.message || errorData.error || msg;
        }
      } else if (error instanceof Error) {
        // Tratamento dos erros lançados no Frontend
        msg = error.message;
      }

      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Box sx={{ mt: 2, p: 4 }}>
      {/* MENSAGENS GLOBAIS DE SUCESSO/ERRO */}
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
        Editar Produto
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        !error && (
          /* 3. FORMULÁRIO (SÓ APARECE SE NÃO ESTIVER CARREGANDO NEM TIVER ERRO INICIAL) */
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
                // 1. Pega o valor atual do estado (que pode ter espaços)
                const nomeAtual = formData.nome;
                const nomeTrimado = nomeAtual.trim();

                // 2. Verifica se houve alteração e atualiza o estado se necessário
                if (nomeAtual !== nomeTrimado) {
                  setFormData((prevData) => ({
                    ...prevData,
                    nome: nomeTrimado, // Salva o valor trimado de volta no formData
                  }));
                }
              }}
              // 1. ATIVA O ESTILO DE ERRO (BORDA VERMELHA)
              error={!!formErrors.nome}
              // 2. EXIBE A MENSAGEM DE ERRO (HELPER TEXT)
              helperText={formErrors.nome}
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
                // 1. Pega o valor atual do estado (que pode ter espaços)
                const descricaoAtual = formData.descricao;
                const descricaoTrimado = descricaoAtual.trim();

                // 2. Verifica se houve alteração e atualiza o estado se necessário
                if (descricaoAtual !== descricaoTrimado) {
                  setFormData((prevData) => ({
                    ...prevData,
                    descricao: descricaoTrimado, // Salva o valor trimado de volta no formData
                  }));
                }
              }}
              error={!!formErrors.descricao}
              helperText={formErrors.descricao}
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
              value={rawValor} // <<< USA O ESTADO DE STRING AUXILIAR
              onChange={handleChange}
              onBlur={handleBlurValor} // <<< CHAMA A LIMPEZA E SALVAMENTO FINAL
              error={!!formErrors.valor}
              helperText={formErrors.valor}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            {/* 4. Select para Categoria */}
            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{ mb: 2 }}
              // <<< Conecta o estado de erro ao FormControl >>>
              error={!!formErrors.categoriaId}
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
                } // Converte para string para o Select
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
              {/* <<< Exibe a mensagem de erro (helper text) >>> */}
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

            {/* 5.  Multi-Select para Lojas */}
            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{ mb: 2 }}
              // <<< Conecta o estado de erro ao FormControl >>>
              error={!!formErrors.lojasId}
            >
              <InputLabel id="lojas">Lojas</InputLabel>
              <Select
                labelId="lojas"
                id="lojas-multiple-chip"
                multiple
                name="lojasId"
                // O VALOR é o array de números (number[]) do seu state
                value={formData.lojasId}
                // SOLUÇÃO DE TIPAGEM: Usamos uma função anônima que recebe o evento tipado
                // e passa para o handleChange, que aceita o SelectChangeEvent.
                onChange={(event) => handleChange(event as SelectChangeEvent)}
                label="Lojas"
                // renderValue é tipado com number[] para funcionar com o value
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
                  // O valor do MenuItem também é numérico (number)
                  <MenuItem key={loja.id} value={loja.id}>
                    {loja.nome}
                  </MenuItem>
                ))}
              </Select>
              {/* <<< Exibe a mensagem de erro (helper text) >>> */}
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

            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting} // Desabilita o botão durante o submit
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar"}
            </Button>
          </Box>
        )
      )}
    </Box>
  );
}
