const API_URL = "https://vivosis.vercel.app/api/pedido";

export const getPedidosPendientes = async () => {
  const response = await fetch(`${API_URL}/getPedidosPendientes`);
  const data = await response.json();
  return data;
};

export const getPedidosAyer = async () => {
    const response = await fetch(`${API_URL}/getPedidosAyer`);
    const data = await response.json();
    return data;
  };

  export const getPedidosSemana = async () => {
    const response = await fetch(`${API_URL}/getPedidosSemana`);
    const data = await response.json();
    return data;
  };
  
  export const getPedidosMes = async () => {
    const response = await fetch(`${API_URL}/getPedidosMes`);
    const data = await response.json();
    return data;
  };

  export const getPedidosHoy = async () => {
    const response = await fetch(`${API_URL}/getPedidosHoy`);
    const data = await response.json();
    return data;
  }