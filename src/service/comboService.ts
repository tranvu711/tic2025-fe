import type { Combo } from '../types';

export interface ComboSuggestionItem {
  sku: string;
  name: string;
  originalPrice: number;
  unitPriceAfterTax: number;
  category: string;
  sales_30d: number;
  rating_avg: number;
  in_existing_combo: boolean;
}

export interface ComboSuggestion {
  combo_name: string;
  rationale: string;
  items: ComboSuggestionItem[];
}

export async function fetchCombos() {
  const response = await fetch('https://dummyjson.com/products');
  if (!response.ok) throw new Error('Failed to fetch combos');
  return response.json();
}

export async function fetchComboById(id: string) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch combo');
  return response.json();
}

export async function createCombo(data: Combo) {
  const response = await fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create combo');
  return response.json();
}

export async function updateCombo(id: string, data: Combo) {
  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update combo');
  return response.json();
}

export async function deleteCombo(id: string) {
  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete combo');
  return response.json();
}

export async function fetchSuggestedCombos(payload?: Record<string, unknown>) {
  const response = await fetch('http://127.0.0.1:8000/suggest-combo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!response.ok) throw new Error('Failed to fetch suggested combos');
  const data = await response.json();
  return data.suggestions as ComboSuggestion[];
} 