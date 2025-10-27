import type { CategoriaDTO } from "./categoria";
import type { LojaDTO } from "./loja";

export type ProdutoDTO = {
  id: number;
  nome: string;
  descricao: string;
  valor: number;

  categoria: CategoriaDTO;

  lojas: LojaDTO[];
};

export type ProdutoUpdateDTO = {
  nome: string;
  descricao: string;
  valor: number;
  categoria: { id: number };
  lojas: { id: number }[];
};
