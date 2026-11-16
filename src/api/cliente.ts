import type { Producto, ProductoCrear } from './tipos';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(
  /\/+$/,
  '',
);

export class ErrorApi extends Error {
  public readonly estado: number;

  constructor(
    mensaje: string,
    estado: number,
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
  }
}

async function verificarRespuesta(respuesta: Response): Promise<void> {
  if (respuesta.ok) {
    return;
  }

  let mensaje = `La API respondió con un error (código ${respuesta.status}).`;

  try {
    const cuerpo: unknown = await respuesta.json();
    if (typeof cuerpo === 'object' && cuerpo !== null && 'detail' in cuerpo) {
      if (typeof cuerpo.detail === 'string') {
        mensaje = cuerpo.detail;
      } else if (respuesta.status === 422) {
        mensaje = 'Los datos enviados no son válidos. Revisa los campos.';
      }
    }
  } catch {
    if (respuesta.status === 422) {
      mensaje = 'Los datos enviados no son válidos. Revisa los campos.';
    }
  }

  throw new ErrorApi(mensaje, respuesta.status);
}

export async function listarProductos(): Promise<Producto[]> {
  const respuesta = await fetch(`${API_URL}/productos`);
  await verificarRespuesta(respuesta);
  return (await respuesta.json()) as Producto[];
}

export async function crearProducto(
  producto: ProductoCrear,
): Promise<Producto> {
  const respuesta = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  await verificarRespuesta(respuesta);
  return (await respuesta.json()) as Producto;
}
