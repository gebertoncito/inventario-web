export interface Producto {
  id: number;
  nombre: string;
  precio: string;
  stock: number;
  activo: boolean;
}

export interface ProductoCrear {
  nombre: string;
  precio: number;
  stock: number;
}
