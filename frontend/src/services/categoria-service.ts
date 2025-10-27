import axios from "axios";
import type { CategoriaDTO, CategoriaInputDTO } from "../models/categoria";
import { BASE_URL } from "../utils/system";

export async function findAll(): Promise<CategoriaDTO[]> {
  const response = await axios.get(`${BASE_URL}/categorias`);

  return response.data;
}

export async function deleteById(id: number) {
  await axios.delete(`${BASE_URL}/categorias/${id}`);
}

export async function findById(id: number): Promise<CategoriaDTO> {
  const response = await axios.get(`${BASE_URL}/categorias/${id}`);

  return response.data;
}

export async function update(categoria: CategoriaDTO) {
  const response = await axios.put(
    `${BASE_URL}/categorias/${categoria.id}`,
    categoria
  );
  return response.data;
}

export async function save(categoria: CategoriaInputDTO): Promise<void> {
  await axios.post(`${BASE_URL}/categorias`, categoria);
}
