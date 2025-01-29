// src/config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function makeAPICall(endpoint: string, data: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}