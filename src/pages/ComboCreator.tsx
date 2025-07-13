import React, { useState } from 'react';
import { Plus, Minus, Zap, Calculator, Target, AlertCircle, TrendingUp, Users, DollarSign, Package, Sparkles, Brain, BarChart3, Search, X, ChevronDown, ShoppingCart, Tag, Layers } from 'lucide-react';
import ProductSearchSelect from '../components/ProductSearchSelect';
import type { Product, SelectedProduct } from '../types';

interface ComboRuleCreator {
  id: string;
  name: string;
  description: string;
  suggestedProducts: string[];
  minProducts: number;
  maxProducts: number;
  suggestedDiscount: number;
  targetSegment: string;
}

const ComboCreator: React.FC = () => {
  const [comboName, setComboName] = useState('');
  const [comboDescription, setComboDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [showAIRules, setShowAIRules] = useState(false);

  const mockProducts: Product[] = [
    { id: '1', name: 'iPhone 15 Pro', price: 29990000, category: 'Electronics', stock: 50 },
    { id: '2', name: 'MacBook Air M2', price: 28990000, category: 'Electronics', stock: 30 },
    { id: '3', name: 'AirPods Pro', price: 6490000, category: 'Electronics', stock: 100 },
    { id: '4', name: 'iPad Air', price: 14990000, category: 'Electronics', stock: 25 },
    { id: '5', name: 'Apple Watch Series 9', price: 9990000, category: 'Electronics', stock: 75 },
  ];

  const aiComboRules: ComboRuleCreator[] = [
    {
      id: '1',
      name: 'Combo Apple Ecosystem Pro',
      description: 'Bộ sản phẩm Apple hoàn chỉnh cho người dùng chuyên nghiệp',
      suggestedProducts: ['1', '2', '3'], // iPhone 15 Pro + MacBook Air M2 + AirPods Pro
      minProducts: 3,
      maxProducts: 5,
      suggestedDiscount: 15,
      targetSegment: 'Chuyên gia công nghệ'
    },
    {
      id: '2', 
      name: 'Combo Sinh viên Thông minh',
      description: 'Gói sản phẩm học tập hiệu quả dành cho sinh viên',
      suggestedProducts: ['4', '5'], // iPad Air + Apple Watch Series 9
      minProducts: 2,
      maxProducts: 3,
      suggestedDiscount: 20,
      targetSegment: 'Sinh viên'
    },
    {
      id: '3',
      name: 'Combo Làm việc từ xa',
      description: 'Bộ công cụ hoàn hảo cho làm việc từ xa hiệu quả',
      suggestedProducts: ['2', '3'], // MacBook Air M2 + AirPods Pro
      minProducts: 2,
      maxProducts: 3,
      suggestedDiscount: 12,
      targetSegment: 'Nhân viên văn phòng'
    },
    {
      id: '4',
      name: 'Combo Creator Content',
      description: 'Bộ sản phẩm chuyên nghiệp cho nhà sáng tạo nội dung',
      suggestedProducts: ['1', '4', '5'], // iPhone 15 Pro + iPad Air + Apple Watch Series 9
      minProducts: 3,
      maxProducts: 4,
      suggestedDiscount: 18,
      targetSegment: 'Content Creator'
    }
  ];

  const handleProductSelect = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(prev => 
        prev.map(p => 
          p.id === product.id 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, quantity: Math.max(1, p.quantity + change) }
          : p
      ).filter(p => p.quantity > 0)
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const totalValue = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const totalQuantity = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
  const uniqueCategories = [...new Set(selectedProducts.map(p => p.category))];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCreateCombo = () => {
    if (selectedProducts.length < 2) {
      alert('Combo cần ít nhất 2 sản phẩm');
      return;
    }
    
    const combo = {
      name: comboName,
      description: comboDescription,
      products: selectedProducts,
      totalValue,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };
    
    console.log('Creating combo:', combo);
    alert('Combo đã được tạo thành công!');
  };

  const applyAIRule = (rule: ComboRuleCreator) => {
    // Set combo name and description
    setComboName(rule.name);
    setComboDescription(rule.description);
    
    // Find and add suggested products to selected list
    const suggestedProducts = rule.suggestedProducts
      .map(productId => mockProducts.find(p => p.id === productId))
      .filter(Boolean) as Product[];
    
    // Clear current selection and add suggested products with quantity 1
    setSelectedProducts(suggestedProducts.map(product => ({
      ...product,
      quantity: 1
    })));
    
    // Close AI suggestions dropdown
    setShowAIRules(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tạo Combo Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">Tạo combo sản phẩm thông minh để tăng doanh thu</p>
        </div>
        <button
          onClick={handleCreateCombo}
          disabled={selectedProducts.length < 2}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo Combo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Combo Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Combo Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Thông Tin Combo
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Combo
                </label>
                <input
                  type="text"
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  placeholder="Nhập tên combo..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô Tả
                </label>
                <textarea
                  value={comboDescription}
                  onChange={(e) => setComboDescription(e.target.value)}
                  placeholder="Mô tả combo..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Product Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Quản Lý Sản Phẩm
              </h2>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIRules(!showAIRules)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  AI Gợi Ý
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAIRules ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* AI Rules Dropdown */}
            {showAIRules && (
              <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Gợi Ý Combo Thông Minh
                </h3>
                <div className="space-y-2">
                  {aiComboRules.map(rule => (
                    <div
                      key={rule.id}
                      onClick={() => applyAIRule(rule)}
                      className="bg-white rounded-lg p-3 border border-purple-100 hover:border-purple-300 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{rule.name}</div>
                          <div className="text-sm text-gray-600">{rule.description}</div>
                          <div className="text-xs text-purple-600 mt-1">
                            {rule.minProducts}-{rule.maxProducts} sản phẩm • Giảm {rule.suggestedDiscount}% • {rule.targetSegment}
                          </div>
                        </div>
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ProductSearchSelect
              products={mockProducts}
              selectedProducts={selectedProducts}
              onAddProduct={handleProductSelect}
             formatPrice={formatPrice}
              placeholder="Tìm kiếm sản phẩm để thêm vào combo..."
            />
          </div>

          {/* Selected Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sản phẩm đã chọn</h3>
                    <p className="text-blue-100 text-sm">
                      {selectedProducts.length} SKU • {totalQuantity} sản phẩm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{formatPrice(totalValue)}</div>
                  <div className="text-blue-100 text-sm">Tổng giá trị</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Categories */}
              {uniqueCategories.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {uniqueCategories.map(category => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
                  <p className="text-gray-500">Tìm kiếm và thêm sản phẩm để tạo combo</p>
                </div>
              ) : selectedProducts.length < 2 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900">Cần thêm sản phẩm</h4>
                      <p className="text-red-700 text-sm">Combo cần ít nhất 2 sản phẩm để tạo</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {selectedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-gray-200 rounded text-xs">{product.category}</span>
                            <span>•</span>
                            <span>{formatPrice(product.price)}</span>
                            <span>•</span>
                            <span>Tồn: {product.stock}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-3 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-[6rem]">
                          <div className="font-semibold text-green-600">
                            {formatPrice(product.price * product.quantity)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboCreator;