import { Navigate, Route, Routes } from "react-router-dom";
import ListarCategorias from "../pages/categorias/listar-categorias";
import ListarProdutos from "../pages/produtos/listar-produtos";
import EditarCategoria from "../pages/categorias/editar-categoria";
import FormularioNovaCategoria from "../pages/categorias/formulario-nova-categoria";
import EditarProdutoForm from "../pages/produtos/editar-produto";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<h1>Página Principal</h1>} />
      <Route path="/categorias" element={<ListarCategorias />} />
      <Route path="/produtos" element={<ListarProdutos />} />
      <Route path="/categorias/novo" element={<FormularioNovaCategoria />} />

      <Route
        path="/categorias/editar/:categoriaId"
        element={<EditarCategoria />}
      />

      <Route
        path="/produtos/editar/:produtoId"
        element={<EditarProdutoForm />}
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
