const API_URL = "https://vivosis-back-v2.vercel.app/api/subcategoria";

export const getSubcategorias = async () => {
    const response = await fetch(`${API_URL}/getallsubcategorias`);
    const data = await response.json();
    return data;
    }

export const getSubcategoriasByIdCategoria = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    return data;
    }