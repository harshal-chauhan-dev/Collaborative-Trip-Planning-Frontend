const BASE_URL = '/api';

class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const request = async (method, path, data) => {
  const options = {
    method,
    credentials: 'include',
    headers: {},
  };

  if (data instanceof FormData) {
    options.body = data;
  } else if (data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 204) return null;

  const json = await res.json();

  if (!res.ok) {
    const err = json.error ?? {};
    throw new ApiError(err.message ?? 'Request failed', res.status, err.code, err.details);
  }

  return json;
};

export const api = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data),
  patch: (path, data) => request('PATCH', path, data),
  delete: (path) => request('DELETE', path),
};

export { ApiError };
