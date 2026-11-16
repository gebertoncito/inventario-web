import { useState, type FormEvent } from 'react';
import { ErrorApi } from '../api/cliente';
import type { ProductoCrear } from '../api/tipos';

interface FormularioProductoProps {
  onCrear: (producto: ProductoCrear) => Promise<void>;
}

export function FormularioProducto({ onCrear }: FormularioProductoProps) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setConfirmacion(null);

    const nombreLimpio = nombre.trim();
    const precioNumerico = Number(precio);
    const stockNumerico = Number(stock);

    if (!nombreLimpio || !precio.trim() || !stock.trim()) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    if (nombreLimpio.length > 120) {
      setError('El nombre no puede superar los 120 caracteres.');
      return;
    }
    if (
      !/^\d+(?:\.\d{1,2})?$/.test(precio) ||
      !Number.isFinite(precioNumerico) ||
      precioNumerico <= 0
    ) {
      setError('El precio debe ser mayor que 0 y tener máximo 2 decimales.');
      return;
    }
    if (
      !/^\d+$/.test(stock) ||
      !Number.isSafeInteger(stockNumerico) ||
      stockNumerico < 0
    ) {
      setError('El stock inicial debe ser un entero mayor o igual a 0.');
      return;
    }

    setGuardando(true);
    try {
      await onCrear({
        nombre: nombreLimpio,
        precio: precioNumerico,
        stock: stockNumerico,
      });
      setNombre('');
      setPrecio('');
      setStock('0');
      setConfirmacion('Producto agregado al inventario.');
    } catch (errorDesconocido: unknown) {
      if (errorDesconocido instanceof ErrorApi && errorDesconocido.estado === 422) {
        setError(
          'La API rechazó los datos del producto. Verifica los campos e inténtalo de nuevo.',
        );
      } else if (errorDesconocido instanceof ErrorApi) {
        setError(errorDesconocido.message);
      } else {
        setError(
          'No se pudo conectar con la API. Comprueba tu conexión e inténtalo de nuevo.',
        );
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="panel panel-formulario" aria-labelledby="titulo-nuevo-producto">
      <div className="encabezado-panel">
        <div>
          <p className="sobrelinea">AÑADIR AL CATÁLOGO</p>
          <h2 id="titulo-nuevo-producto">Nuevo producto</h2>
        </div>
        <span className="icono-agregar" aria-hidden="true">
          +
        </span>
      </div>

      <form className="formulario-producto" onSubmit={manejarEnvio} noValidate>
        <label htmlFor="nombre-producto">Nombre</label>
        <input
          autoComplete="off"
          id="nombre-producto"
          maxLength={120}
          name="nombre"
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="Ej. Café molido"
          required
          value={nombre}
        />
        <p className="ayuda-campo">Hasta 120 caracteres.</p>

        <label htmlFor="precio-producto">Precio</label>
        <div className="entrada-precio">
          <input
            id="precio-producto"
            inputMode="decimal"
            min="0.01"
            name="precio"
            onChange={(evento) => setPrecio(evento.target.value)}
            placeholder="0.00"
            required
            step="0.01"
            type="number"
            value={precio}
          />
        </div>

        <label htmlFor="stock-producto">Stock inicial</label>
        <input
          id="stock-producto"
          min="0"
          name="stock"
          onChange={(evento) => setStock(evento.target.value)}
          required
          step="1"
          type="number"
          value={stock}
        />

        {error && (
          <p className="mensaje-error mensaje-formulario" role="alert">
            {error}
          </p>
        )}
        {confirmacion && (
          <p className="mensaje-confirmacion" role="status">
            {confirmacion}
          </p>
        )}

        <button className="boton-crear" disabled={guardando} type="submit">
          {guardando ? 'Guardando…' : 'Agregar producto'}
        </button>
      </form>
    </section>
  );
}
