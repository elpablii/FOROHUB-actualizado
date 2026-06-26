export interface Topico {
  id: number;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  estado: string;
  usuario: string;
  curso: string;
}

export interface Curso {
  id: number;
  nombre: string;
  categoria: string;
}

export interface Respuesta {
  id: number;
  nombreAutor: string;
  mensaje: string;
  solucion: string;
  fechaCreacion: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface LoginResponse {
  jwtToken: string;
}
