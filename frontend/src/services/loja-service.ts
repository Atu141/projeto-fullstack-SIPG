import axios from "axios";
import type { LojaDTO } from "../models/loja";
import { BASE_URL } from "../utils/system";

export async function findAll(): Promise<LojaDTO[]> {
  const response = await axios.get(`${BASE_URL}/lojas`);

  return response.data;
}
