import { Navigate, Route, Routes } from "react-router-dom";
import ListarCategorias from "../pages/categorias/listar-categorias";
import ListarProdutos from "../pages/produtos/listar-produtos";
import EditarCategorias from "../pages/categorias/editar-categorias";


export default function AppRouter(){

    return( 

        <Routes>
            <Route path="/" element={<h1>Página Principal</h1>} />
            <Route path="/categorias" element={<ListarCategorias />} />
            <Route path="/produtos" element={<ListarProdutos />} />
            <Route
                path="/categorias/:categotiaId/editar"
                element={<EditarCategorias/>}
            />
            <Route path="*" element={<Navigate to="/"/>}/>

        </Routes>

    );
}