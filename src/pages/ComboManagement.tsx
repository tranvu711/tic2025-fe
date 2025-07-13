import React, { useState } from 'react';
import { Search, Filter, Edit3, Trash2, Eye, ToggleLeft, ToggleRight, Calendar, Users, Package, DollarSign, X, Plus, Minus, Save, ShoppingCart } from 'lucide-react';
import type { Combo, SelectedProduct } from '../types';
import ProductSearchSelect from '../components/ProductSearchSelect';

const ComboManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Available products for adding to combo
  const availableProducts = [
    { id: 1, name: 'iPhone 15 Pro', price: 29990000, category: 'Smartphone', stock: 150, popularity: 95, margin: 25 },
    { id: 2, name: 'AirPods Pro 2', price: 6190000, category: 'Accessory', stock: 300, popularity: 88, margin: 35 },
    { id: 3, name: 'MacBook Air M3', price: 32990000, category: 'Laptop', stock: 80, popularity: 92, margin: 20 },
    { id: 4, name: 'Magic Mouse', price: 2390000, category: 'Accessory', stock: 200, popularity: 75, margin: 40 },
    { id: 5, name: 'iPad Pro 12.9"', price: 31990000, category: 'Tablet', stock: 120, popularity: 85, margin: 22 },
    { id: 6, name: 'Apple Pencil 2', price: 3490000, category: 'Accessory', stock: 180, popularity: 78, margin: 45 },
    { id: 7, name: 'Samsung Galaxy S24', price: 24990000, category: 'Smartphone', stock: 200, popularity: 82, margin: 28 },
    { id: 8, name: 'Galaxy Buds Pro', price: 4990000, category: 'Accessory', stock: 250, popularity: 80, margin: 38 },
    { id: 9, name: 'Dell XPS 13', price: 28990000, category: 'Laptop', stock: 90, popularity: 78, margin: 18 },
    { id: 10, name: 'Logitech MX Master 3', price: 2190000, category: 'Accessory', stock: 150, popularity: 72, margin: 42 },
  ];

  // Mock data
  const [combos, setCombos] = useState<Combo[]>([
    {
      id: '1',
      name: 'Combo Gaming Pro',
      description: 'Combo hoàn hảo cho game thủ với iPhone và AirPods chất lượng cao',
      products: [
        { id: 1, name: 'iPhone 15 Pro', price: 28990000, category: 'Điện thoại', stock: 45, quantity: 1 },
        { id: 2, name: 'AirPods Pro 2', price: 6490000, category: 'Phụ kiện', stock: 120, quantity: 1 }
      ],
      totalValue: 35480000,
      orders: 156,
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Combo Văn phòng',
      description: 'Bộ sản phẩm lý tưởng cho công việc văn phòng hiệu quả',
      products: [
        { id: 3, name: 'MacBook Air M2', price: 27990000, category: 'Laptop', stock: 30, quantity: 1 },
        { id: 4, name: 'Magic Mouse', price: 2290000, category: 'Phụ kiện', stock: 80, quantity: 1 }
      ],
      totalValue: 30280000,
      orders: 89,
      createdAt: '2024-01-10',
      status: 'active'
    },
    {
      id: '3',
      name: 'Combo Học tập',
      description: 'Combo dành cho sinh viên và học sinh với iPad và Apple Pencil',
      products: [
        { id: 5, name: 'iPad Air', price: 14990000, category: 'Tablet', stock: 25, quantity: 1 },
        { id: 6, name: 'Apple Pencil', price: 2990000, category: 'Phụ kiện', stock: 60, quantity: 1 }
      ],
      totalValue: 17980000,
      orders: 234,
      createdAt: '2024-01-08',
      status: 'active'
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Hoạt động', color: 'bg-green-100 text-green-800' },
      paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredCombos = combos.filter(combo => {
    const matchesSearch = combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         combo.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || combo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleComboStatus = (comboId: string) => {
    setCombos(prev => prev.map(combo => 
      combo.id === comboId 
        ? { ...combo, status: combo.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' }
        : combo
    ));
  };

  const addProductToEdit = (product: any) => {
    if (!editingCombo) return;
    
    // Check if product already exists
    if (editingCombo.products.find(p => p.id === product.id)) return;
    
    setEditingCombo(prev => ({
      ...prev!,
      products: [...prev!.products, { ...product, quantity: 1 }]
    }));
  };

  const deleteCombo = (comboId: string) => {
    setCombos(prev => prev.filter(combo => combo.id !== comboId));
  };

  const openDetailModal = (combo: Combo) => {
    setSelectedCombo(combo);
    setShowDetailModal(true);
  };

  const openEditModal = (combo: Combo) => {
    setEditingCombo({ ...combo });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowEditModal(false);
    setSelectedCombo(null);
    setEditingCombo(null);
  };

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (!editingCombo) return;
    
    setEditingCombo(prev => ({
      ...prev!,
      products: prev!.products.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(1, newQuantity) }
          : product
      )
    }));
  };

  const removeProductFromEdit = (productId: string) => {
    if (!editingCombo) return;
    
    setEditingCombo(prev => ({
      ...prev!,
      products: prev!.products.filter(product => product.id !== productId)
    }));
  };

  const calculateEditTotal = () => {
    if (!editingCombo) return 0;
    return editingCombo.products.reduce((total, product) => 
      total + (product.price * (product.quantity || 1)), 0
    );
  };

  const saveComboChanges = () => {
    if (!editingCombo) return;
    
    const updatedCombo = {
      ...editingCombo,
      totalValue: calculateEditTotal()
    };
    
    setCombos(prev => prev.map(combo => 
      combo.id === editingCombo.id ? updatedCombo : combo
    ));
    
    closeModals();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Combo</h1>
        <p className="text-gray-600">Quản lý và theo dõi hiệu suất các combo sản phẩm</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm combo hoặc sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="paused">Tạm dừng</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Combos Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Combo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tổng giá trị</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Đơn hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCombos.map((combo) => (
                <tr key={combo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{combo.name}</h3>
                      <div className="text-sm text-gray-600">
                        {combo.products.map((product, index) => (
                          <span key={product.id}>
                            {product.name}
                            {index < combo.products.length - 1 && ' + '}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(combo.totalValue)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{combo.orders}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{formatDate(combo.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      {getStatusBadge(combo.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openDetailModal(combo)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(combo)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleComboStatus(combo.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title={combo.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                      >
                        {combo.status === 'active' ? 
                          <ToggleRight className="w-4 h-4" /> : 
                          <ToggleLeft className="w-4 h-4" />
                        }
                      </button>
                      <button
                        onClick={() => deleteCombo(combo.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCombo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Chi tiết Combo</h2>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedCombo.name}</h3>
                {selectedCombo.description && (
                  <p className="text-gray-600 mb-4">{selectedCombo.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Số sản phẩm:</span>
                    <span className="font-medium">{selectedCombo.products.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Đơn hàng:</span>
                    <span className="font-medium">{selectedCombo.orders}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Tổng giá trị:</span>
                    <span className="font-medium">{formatPrice(selectedCombo.totalValue)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-medium">{formatDate(selectedCombo.createdAt)}</span>
                  </div>
                </div>
                {getStatusBadge(selectedCombo.status)}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm trong combo</h4>
                <div className="space-y-3">
                  {selectedCombo.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{product.name}</h5>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                        <p className="text-sm text-gray-600">Tồn kho: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCombo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa Combo</h2>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên combo
                    </label>
                    <input
                      type="text"
                      value={editingCombo.name}
                      onChange={(e) => setEditingCombo(prev => ({ ...prev!, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={editingCombo.description || ''}
                      onChange={(e) => setEditingCombo(prev => ({ ...prev!, description: e.target.value }))}
                      placeholder="Mô tả combo..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={editingCombo.status}
                      onChange={(e) => setEditingCombo(prev => ({ 
                        ...prev!, 
                        status: e.target.value as 'active' | 'paused'
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="paused">Tạm dừng</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Thêm sản phẩm</h4>
                    <ProductSearchSelect 
                      products={availableProducts}
                      selectedProducts={editingCombo.products}
                      onAddProduct={addProductToEdit}
                      formatPrice={formatPrice}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Sản phẩm trong combo</h4>
                    <div className="space-y-3">
                      {editingCombo.products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{product.name}</h5>
                            <p className="text-sm text-gray-600">{product.category} • {formatPrice(product.price)}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <button
                              onClick={() => updateProductQuantity(product.id, (product.quantity || 1) - 1)}
                              className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{product.quantity || 1}</span>
                            <button
                              onClick={() => updateProductQuantity(product.id, (product.quantity || 1) + 1)}
                              className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeProductFromEdit(product.id)}
                              className="ml-4 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar - Price Calculator */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Tính toán giá</h4>
                    <div className="space-y-3">
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Tổng giá trị:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatPrice(calculateEditTotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={saveComboChanges}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      onClick={closeModals}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboManagement;