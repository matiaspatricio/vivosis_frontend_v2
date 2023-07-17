const API_URL = "https://vivosis.vercel.app/api/pedido";

export const getPedidosPendientes = async () => {
  const response = await fetch(`${API_URL}/getpedidospendientes`);
  const data = await response.json();
  return data;
};

export const getPedidosAyer = async () => {
    const response = await fetch(`${API_URL}/getpedidosayer`);
    const data = await response.json();
    return data;
  };

  export const getPedidosSemana = async () => {
    const response = await fetch(`${API_URL}/getpedidossemana`);
    const data = await response.json();
    return data;
  };
  export const getPedidosSemanaAnterior = async () => {
    const response = await fetch(`${API_URL}/getpedidossemanaanterior`);
    const data = await response.json();
    return data;
  };
  
  export const getPedidosMes = async () => {
    const response = await fetch(`${API_URL}/getpedidosmes`);
    const data = await response.json();
    return data;
  };

  export const getPedidosHoy = async () => {
    const response = await fetch(`${API_URL}/getpedidoshoy`);
    const data = await response.json();
    return data;
  }