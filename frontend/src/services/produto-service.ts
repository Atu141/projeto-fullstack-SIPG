import axios from "axios";
import type { ProdutoDTO, ProdutoUpdateDTO } from "../models/produto";
import { BASE_URL } from "../utils/system";

export async function findAll(): Promise<ProdutoDTO[]> {
  const response = await axios.get(`${BASE_URL}/produtos`);

  return response.data;
}

export async function deleteById(id: number) {
  await axios.delete(`${BASE_URL}/produtos/${id}`);
}

export async function findById(id: number): Promise<ProdutoDTO> {
  const response = await axios.get(`${BASE_URL}/produtos/${id}`);

  return response.data;
}

export async function updateProduto(
  produtoId: number,
  requestBody: ProdutoUpdateDTO
): Promise<ProdutoDTO> {
  const response = await axios.put(
    `${BASE_URL}/produtos/${produtoId}`,
    requestBody
  );

  return response.data;
}
