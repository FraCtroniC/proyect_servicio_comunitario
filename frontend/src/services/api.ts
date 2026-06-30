const SESSION_KEY = 'liceo-auth-session';

function getSessionToken(): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.sessionToken && data.expiresAt && Date.now() < data.expiresAt) {
      return data.sessionToken;
    }
  } catch {
    // ignorar
  }
  return null;
}

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const token = getSessionToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let finalUrl = url;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      finalUrl += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error en la petición al servidor (Status: ${response.status} - ${response.statusText} en ${url})`;
    try {
      const errJson = await response.json();
      if (errJson.error && errJson.error.message) {
        errorMsg = errJson.error.message;
      }
    } catch (e) {
      // Ignorar si no es JSON válido
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const resJson = await response.json();
  return resJson.data !== undefined ? resJson.data : resJson;
}

export const api = {
  get: <T>(url: string, params?: Record<string, any>) => request<T>(url, { method: 'GET', params }),
  post: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
  materiasPendientes: {
    getAll: () => request('/api/materias-pendientes'),
    getByStudent: (id: string) => request(`/api/materias-pendientes/estudiante/${id}`),
    create: (data: any) => request('/api/materias-pendientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/materias-pendientes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  notificaciones: {
    alertaAcademica: (data: any) => request('/api/notificaciones/alerta-academica', { method: 'POST', body: JSON.stringify(data) })
  },
  historicoNotas: {
    getByStudent: (id: string) => request(`/api/historicos/estudiante/${id}`),
    createBulk: (data: any) => request('/api/historicos/bulk', { method: 'POST', body: JSON.stringify(data) }),
    downloadExcel: async (estudianteId: string, plan: string) => {
      const token = getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/historicos/${estudianteId}/generar-excel?plan=${plan}`, { headers });
      if (!res.ok) {
        let msg = 'Error al generar el Excel';
        try { const err = await res.json(); msg = err.error?.message || msg; } catch {}
        throw new Error(msg);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Notas_Certificadas_${estudianteId}_Plan_${plan}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  },
  especialidades: {
    getAll: () => request('/api/especialidades'),
    create: (data: { nombre: string }) => request('/api/especialidades', { method: 'POST', body: JSON.stringify(data) })
  },
  chatbot: {
    consultar: (mensaje: string, roleId: number, nombre: string) =>
      request<{ respuesta: string }>('/api/chatbot/consultar', {
        method: 'POST',
        body: JSON.stringify({ mensaje, roleId, nombre }),
      }),
  }
};
