import { expect, test } from '@playwright/test';
import type { Producto, ProductoCrear } from '../src/api/tipos';

test('crea un producto y lo muestra en el inventario', async ({ page }) => {
  let productoEnviado: ProductoCrear | undefined;

  await page.route('http://localhost:8000/productos', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        json: [
          {
            id: 1,
            nombre: 'Arroz',
            precio: '1250.00',
            stock: 8,
            activo: true,
          } satisfies Producto,
        ],
      });
      return;
    }

    const datosProducto = route.request().postDataJSON() as ProductoCrear;
    productoEnviado = datosProducto;
    await route.fulfill({
      status: 201,
      json: {
        ...datosProducto,
        precio: String(datosProducto.precio),
        id: 2,
        activo: true,
      } satisfies Producto,
    });
  });

  await page.goto('/');
  await expect(page.getByText('Arroz')).toBeVisible();
  await page.getByLabel('Nombre').fill('Café');
  await page.getByLabel('Precio').fill('1850.75');
  await page.getByLabel('Stock inicial').fill('5');
  await page.getByRole('button', { name: 'Agregar producto' }).click();

  await expect(page.locator('.lista-productos').getByText('Café')).toBeVisible();
  await expect(page.getByText('Stock: 5 unidades')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText(
    'Producto agregado al inventario.',
  );
  expect(productoEnviado).toEqual({
    nombre: 'Café',
    precio: 1850.75,
    stock: 5,
  });
});
