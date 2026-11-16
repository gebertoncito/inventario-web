import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { Producto, ProductoCrear } from '../../src/api/tipos';

const API_URL = 'http://localhost:8000';

const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: 'Arroz',
    precio: '1250.00',
    stock: 8,
    activo: true,
  },
];

export const servidor = setupServer(
  http.get(`${API_URL}/productos`, () => HttpResponse.json(productosIniciales)),
  http.post(`${API_URL}/productos`, async ({ request }) => {
    const producto = (await request.json()) as ProductoCrear;
    return HttpResponse.json(
      { ...producto, precio: String(producto.precio), id: 2, activo: true },
      { status: 201 },
    );
  }),
);
