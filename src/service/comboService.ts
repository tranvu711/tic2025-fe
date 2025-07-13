import type { Combo } from '../types';

export interface ComboSuggestionItem {
  sku: string;
  name: string;
  originalPrice: number;
  price: number;
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

export interface ComboCreatePayload {
  combo_id?: string;
  created_by: string;
  items: Array<{
    category: string;
    name: string;
    originalPrice: number;
    rating_avg: number;
    sku: string;
    price: number;
  }>;
  name: string;
  note: string;
  status: string;
}

export interface ComboListItem {
  id: string;
  name: string;
  note: string;
  status: string;
  createdAt: string;
  createdBy: string;
  items: Array<{
    category: string;
    name: string;
    originalPrice: number;
    rating_avg: number;
    sku: string;
    price: number;
  }>;
}

export async function fetchCombos() {
  const response = await fetch('https://tic2025.tranvu.info/api/combos');
  if (!response.ok) throw new Error('Failed to fetch combos');
  const data = await response.json();

  // Trả về mảng combo
  return data.data as ComboListItem[]||[];
}

export async function fetchComboById(id: string) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch combo');
  return response.json();
}

export async function upsertCombo(data: ComboCreatePayload) {
  const response = await fetch('https://tic2025.tranvu.info/api/combos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to upsert combo');
  return response.json();
}

export async function updateCombo(id: string, data: Combo) {
  const response = await fetch('https://tic2025.tranvu.info/api/combos', {
    method: 'POST',
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
  const response = await fetch('https://tic2025.tranvu.info/api/suggest-combo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!response.ok) throw new Error('Failed to fetch suggested combos');
  const data = await response.json();
  return data.data.suggestions as ComboSuggestion[];
}

export async function getProducts() {
  const response = await fetch('https://tic2025.tranvu.info/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  // Trả về mảng sản phẩm, giả sử data.products
  return data.data||[];
} 