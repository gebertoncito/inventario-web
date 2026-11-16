import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { servidor } from '../tests/mocks/servidor';

const API_URL = 'http://localhost:8000';

describe('inventario de productos', () => {
  it('muestra los productos activos que devuelve la API', async () => {
    servidor.use(
      http.get(`${API_URL}/productos`, () =>
        HttpResponse.json([
          {
            id: 1,
            nombre: 'Arroz',
            precio: '1250.00',
            stock: 8,
            activo: true,
          },
        ]),
      ),
    );
    render(<App />);

    const producto = await screen.findByText('Arroz');
    const fila = producto.closest('li');

    expect(fila).not.toBeNull();
    expect(within(fila as HTMLElement).getByText('Stock: 8 unidades')).toBeInTheDocument();
    expect(within(fila as HTMLElement).getByText(/1\s?250,00/)).toBeInTheDocument();
  });

  it('valida campos vacíos y precio no positivo antes de llamar a la API', async () => {
    const user = userEvent.setup();
    const llamadaCrear = vi.fn();
    servidor.use(
      http.post(`${API_URL}/productos`, () => {
        llamadaCrear();
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    render(<App />);
    await screen.findByText('Arroz');

    await user.click(screen.getByRole('button', { name: 'Agregar producto' }));
    expect(
      screen.getByRole('alert', { name: '' }),
    ).toHaveTextContent('Completa todos los campos obligatorios.');

    await user.type(screen.getByLabelText('Nombre'), 'Frijoles');
    await user.type(screen.getByLabelText('Precio'), '0');
    await user.click(screen.getByRole('button', { name: 'Agregar producto' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El precio debe ser mayor que 0',
    );
    expect(llamadaCrear).not.toHaveBeenCalled();
  });

  it('añade a la lista el producto creado', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Arroz');

    await user.type(screen.getByLabelText('Nombre'), 'Frijoles');
    await user.type(screen.getByLabelText('Precio'), '850.5');
    await user.clear(screen.getByLabelText('Stock inicial'));
    await user.type(screen.getByLabelText('Stock inicial'), '12');
    await user.click(screen.getByRole('button', { name: 'Agregar producto' }));

    const productoCreado = await screen.findByText('Frijoles');
    const fila = productoCreado.closest('li');
    expect(fila).not.toBeNull();
    expect(within(fila as HTMLElement).getByText('Stock: 12 unidades')).toBeInTheDocument();
    expect(within(fila as HTMLElement).getByText(/850,50/)).toBeInTheDocument();
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Producto agregado al inventario.',
    );
  });

  it('muestra un mensaje en español cuando la API responde 422', async () => {
    const user = userEvent.setup();
    servidor.use(
      http.post(`${API_URL}/productos`, () =>
        HttpResponse.json(
          { detail: [{ loc: ['body', 'precio'], msg: 'Input should be greater than 0' }] },
          { status: 422 },
        ),
      ),
    );

    render(<App />);
    await screen.findByText('Arroz');
    await user.type(screen.getByLabelText('Nombre'), 'Harina');
    await user.type(screen.getByLabelText('Precio'), '700');
    await user.click(screen.getByRole('button', { name: 'Agregar producto' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'La API rechazó los datos del producto.',
      );
    });
    expect(screen.getByRole('alert')).not.toHaveTextContent('Input should');
  });
});
