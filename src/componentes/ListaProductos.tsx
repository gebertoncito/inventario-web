import type { Producto } from '../api/tipos';

interface ListaProductosProps {
  productos: Producto[];
  cargando: boolean;
  error: string | null;
}

const formatoPrecio = new Intl.NumberFormat('es-CR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function ListaProductos({
  productos,
  cargando,
  error,
}: ListaProductosProps) {
  return (
    <section className="panel panel-productos" aria-labelledby="titulo-productos">
      <div className="encabezado-panel">
        <div>
          <p className="sobrelinea">INVENTARIO</p>
          <h2 id="titulo-productos">Productos</h2>
        </div>
        {!cargando && !error && (
          <span className="contador-productos">
            {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      {cargando && (
        <p className="mensaje-estado" role="status">
          Cargando productos…
        </p>
      )}
      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}
      {!cargando && !error && productos.length === 0 && (
        <p className="mensaje-estado">
          Todavía no hay productos activos en el inventario.
        </p>
      )}
      {!cargando && !error && productos.length > 0 && (
        <ul className="lista-productos">
          {productos.map((producto) => (
            <li className="fila-producto" key={producto.id}>
              <span className="avatar-producto" aria-hidden="true">
                {producto.nombre.trim().charAt(0).toLocaleUpperCase('es')}
              </span>
              <div className="datos-producto">
                <h3>{producto.nombre}</h3>
                <p>Stock: {producto.stock} unidades</p>
              </div>
              <span className="precio-producto">
                {formatoPrecio.format(producto.precio)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
