// src/config/api.ts

// Using Vite's environment variable syntax
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API endpoints
export const endpoints = {
  generateQuestion: `${API_URL}/generate-question`,
  checkStep: `${API_URL}/check-step`,
  getExplanation: `${API_URL}/get-explanation`,
  getSolution: `${API_URL}/get-solution`
};

// Common fetch configuration
const defaultConfig: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  }
};

// API functions
export const api = {
  async post(endpoint: string, data: any) {
    const response = await fetch(endpoint, {
      ...defaultConfig,
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};