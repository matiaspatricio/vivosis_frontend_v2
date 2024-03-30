const API_URL = "https://vivosis-back-v2.vercel.app/api/puntoentrega";

export const getPuntosEntrega = async () => {
    const response = await fetch(`${API_URL}/getallpuntosentrega`);
    const data = await response.json();
    return data ;
    }
