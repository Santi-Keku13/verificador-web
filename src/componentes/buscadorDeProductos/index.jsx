import { useState } from 'react';
import axios from 'axios';
import './styles.css';

const BuscadorProductos = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarProducto = async () => {
    if (!codigoBarras.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos?codigo=${codigoBarras.trim()}`);
      
      if (response.data.success) {
        setProducto(response.data.producto);
      } else {
        setProducto(null);
        setError(`¡PRODUCTO NO ENCONTRADO!`);
      }
    } catch (err) {
      setError('ERROR DE CONEXIÓN');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }

    setCodigoBarras('');
    
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarProducto();
    }
  };

  return (
    <div className="buscador-container">
      <div className="buscador-content">
        <h1 className="buscador-title">BLOW MAX</h1>
        
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            value={codigoBarras}
            onChange={(e) => setCodigoBarras(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="INGRESE CÓDIGO"
            autoFocus
          />
        </div>

        {loading && <p className="loading-indicator">CARGANDO...</p>}
        
        {error && <p className="error-message">{error}</p>}
        
        {producto && (
          <div className="product-info">
            <h2 className="product-title">{producto.articulo.toUpperCase()}</h2>
            
            <div className="product-detail">
              <span className="product-label">PRECIO:</span>
              <span className="product-value price-highlight">
                ${producto.precio?.toLocaleString() || 'N/A'}
              </span>
            </div>
            
            <div className="product-detail">
              <span className="product-label">OFERTA:</span>
              <span className="product-value">
                {producto.precioMayorista ? `$${producto.precioMayorista.toLocaleString()}` : 'NO DISPONIBLE'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscadorProductos;