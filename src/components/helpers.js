// helpers.js

// Función para actualizar el stock de un artículo
export const actualizarStock = async (idArticulo, cantidad) => {
    try {
      // Hacer una solicitud al backend para actualizar el stock del artículo
      const response = await fetch(`https://vivosis.vercel.app/api/articulo/${idArticulo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: cantidad }), // Actualizar el stock con la nueva cantidad
      });
  
      if (response.ok) {
        // El stock se actualizó correctamente
        return true;
      } else {
        // Hubo un error al actualizar el stock
        console.log('Error al actualizar el stock del artículo');
        return false;
      }
    } catch (error) {
      console.log('Error al conectar con el servidor:', error);
      return false;
    }
  };
  
  // Función para guardar los cambios en el producto
  export const guardarCambiosEnProducto = async (idPedido, idArticulo, cantidad) => {
    try {
      // Actualizar el stock del artículo
      const stockActualizado = await actualizarStock(idArticulo, cantidad);
  
      if (stockActualizado) {
        // Hacer una solicitud al backend para eliminar el pedido
        const response = await fetch(`https://vivosis.vercel.app/api/pedido/${idPedido}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // El pedido se eliminó correctamente
          return true;
        } else {
          // Hubo un error al eliminar el pedido
          console.log('Error al eliminar el pedido');
          return false;
        }
      } else {
        // Hubo un error al actualizar el stock, no se elimina el pedido
        console.log('Error al actualizar el stock del artículo, no se elimina el pedido');
        return false;
      }
    } catch (error) {
      console.log('Error al conectar con el servidor:', error);
      return false;
    }
  };
  