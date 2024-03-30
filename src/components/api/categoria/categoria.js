const API_URL = "https://vivosis-back-v2.vercel.app/api/categoria";

export const getCategorias = async () => {
    const response = await fetch(`${API_URL}/getallcategorias`);
    const data = await response.json();
    return data;
    }