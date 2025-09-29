import axios from "axios";
import type { CategoriaDTO } from "../models/categoria";
import { BASE_URL } from "../utils/system";

export async function  findAll(): Promise<CategoriaDTO[]> {

    const response = await axios.get(`${BASE_URL}/categorias`);

    return response.data;
    
}