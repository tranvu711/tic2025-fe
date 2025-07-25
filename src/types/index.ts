// Common types used across the application
export type Page = 'combo-creator' | 'combo-management';

export type ComboStatus = 'active' | 'paused';

export interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  stock: number;
  popularity?: number;
  margin?: number;
  image?: string;
  sku?:string; 
}

export interface SelectedProduct extends Product {
  quantity: number;
}

export interface Combo {
  combo_id: string;
  name: string;
  note?: string;
  products: SelectedProduct[];
  totalValue: number;
  createdAt: string;
  status: ComboStatus;
}

export interface ComboRule {
  id: string;
  name: string;
  note: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  isActive: boolean;
}

export interface RuleCondition {
  type: 'category' | 'price_range' | 'stock_level' | 'popularity';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

export interface RuleAction {
  type: 'discount_percentage' | 'discount_fixed' | 'bundle_size';
  value: number;
}

export interface ComboPreviewProps {
  name: string;
  note: string;
  products: SelectedProduct[];
  originalPrice: number;
  salePrice: number;
  discount: number;
  targetSegment: string;
  expectedConversion: number;
  expectedROI: number;
}

export interface ProductSearchSelectProps {
  products: Product[];
  selectedProducts: SelectedProduct[];
  onAddProduct: (product: Product) => void;
  formatPrice: (price: number) => string;
}