import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Package, TrendingUp, X, ChevronDown } from 'lucide-react';
import type { Product, SelectedProduct, ProductSearchSelectProps } from '../types';

const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  products,
  selectedProducts,
  onAddProduct,
  formatPrice
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', name: 'Tất cả danh mục' },
    { id: 'Smartphone', name: 'Smartphone' },
    { id: 'Laptop', name: 'Laptop' },
    { id: 'Tablet', name: 'Tablet' },
    { id: 'Accessory', name: 'Phụ kiện' },
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const notSelected = !selectedProducts.find(p => p.id === product.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredProducts[highlightedIndex]) {
          handleAddProduct(filteredProducts[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleAddProduct = (product: Product) => {
    onAddProduct(product);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Smartphone': 'bg-blue-100 text-blue-800',
      'Laptop': 'bg-purple-100 text-purple-800',
      'Tablet': 'bg-green-100 text-green-800',
      'Accessory': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'bg-emerald-500';
    if (popularity >= 80) return 'bg-green-500';
    if (popularity >= 70) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm sản phẩm để thêm vào combo..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">
                {searchTerm ? 'Không tìm thấy sản phẩm phù hợp' : 'Tất cả sản phẩm đã được thêm'}
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? 'bg-blue-50 border-l-2 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="font-medium">{formatPrice(product.price)}</span>
                        <span className="flex items-center space-x-1">
                          <span>Tồn:</span>
                          <span className={product.stock < 50 ? 'text-red-600 font-medium' : ''}>{product.stock}</span>
                        </span>
                      </div>
                    </div>
                    <button className="ml-3 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {filteredProducts.length > 0 && isOpen && (
        <div className="absolute z-40 w-full mt-1 bg-gray-50 border border-gray-200 rounded-b-lg px-4 py-2 text-xs text-gray-600">
          Tìm thấy {filteredProducts.length} sản phẩm
          {selectedCategory !== 'all' && (
            <span> trong danh mục {categories.find(c => c.id === selectedCategory)?.name}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchSelect;