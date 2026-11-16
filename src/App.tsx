import { useEffect, useState } from 'react';
import { ErrorApi, listarProductos } from './api/cliente';
import type { Producto } from './api/tipos';
import { ListaProductos } from './componentes/ListaProductos';
import './App.css';

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let componenteActivo = true;

    listarProductos()
      .then((productosCargados) => {
        if (componenteActivo) {
          setProductos(productosCargados);
        }
      })
      .catch((errorDesconocido: unknown) => {
        if (!componenteActivo) {
          return;
        }
        setError(
          errorDesconocido instanceof ErrorApi
            ? 'No se pudieron cargar los productos. Inténtalo de nuevo.'
            : 'No se pudo conectar con la API. Comprueba que esté en funcionamiento.',
        );
      })
      .finally(() => {
        if (componenteActivo) {
          setCargando(false);
        }
      });

    return () => {
      componenteActivo = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="barra-superior">
        <a className="marca" href="/" aria-label="Inventario, inicio">
          <span className="marca-icono" aria-hidden="true">
            i
          </span>
          <span>inventario</span>
        </a>
        <span className="estado-conexion">
          <span className="punto-estado" aria-hidden="true" />
          Panel de inventario
        </span>
      </header>

      <section className="introduccion" aria-labelledby="titulo-principal">
        <p className="sobrelinea">CONTROL DE EXISTENCIAS</p>
        <h1 id="titulo-principal">Todo en su lugar.</h1>
        <p className="texto-introduccion">
          Consulta tus productos y mantén el inventario al día.
        </p>
      </section>

      <ListaProductos
        productos={productos}
        cargando={cargando}
        error={error}
      />
    </main>
  );
}

export default App;
