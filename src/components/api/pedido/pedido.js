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

  export const getAllPedidos = async () => {
    const response = await fetch(`${API_URL}/getallpedidos`);
    const data = await response.json();
    return data;
  }
  export const actualizarPedido = async (pedido) => {
    try {
      //console.log('Pedido a actualizar:', pedido);
      const response = await fetch(`https://vivosis.vercel.app/api/pedido/${pedido._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });
  
      const data = await response.json();

      return data;
    } catch (error) {
      console.log('Error al modificar el pedido:', error);
      throw error; // Lanza el error para que pueda ser manejado por la función que llame a esta.
    }
  };
  