import { Calendar, Edit3, Filter, Minus, Plus, Save, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductSearchSelect from "../components/ProductSearchSelect";
import {
  ComboCreatePayload,
  ComboListItem,
  fetchCombos,
  getProducts,
  updateCombo,
  upsertCombo,
} from "../service/comboService";
import type { Combo, Product } from "../types";

// 1. Add a utility to convert ComboListItem to Combo for editing
const comboListItemToCombo = (item: ComboListItem): Combo => ({
  id: item.id,
  name: item.name,
  note: item.note,
  items: item.items?.map((product) => ({
    sku: product.sku,
    name: product.name,
    price: product.price,
    category: product.category,
    stock: 0,
    quantity: 1,
  })),
  totalValue: item.items?.reduce((sum, p) => sum + p.price, 0),
  createdAt: item.createdAt,
  status: item.status as "active" | "inactive",
});

const ComboManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCombo, setSelectedCombo] = useState<ComboListItem | null>(null);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [combos, setCombos] = useState<ComboListItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCombos()
      .then((data) => setCombos(data))
      .catch(() => {});
  }, []);

  const availableProducts: Product[] = [
    // ... giữ lại nếu thực sự dùng cho ProductSearchSelect
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Hoạt động", color: "bg-green-100 text-green-800" },
      inactive: { label: "Tạm dừng", color: "bg-yellow-100 text-yellow-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.color}`}
      >
        {config.label}
      </span>
    );
  };
  const filteredCombos = combos?.filter((combo) => {
    const matchesSearch = combo.name?.toLowerCase()?.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || combo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleComboStatus = (comboId: string) => {
    setCombos((prev) =>
      prev.map((combo) =>
        combo.id === comboId
          ? { ...combo, status: combo.status === "active" ? "inactive" : "active" }
          : combo
      )
    );
  };

  const openDetailModal = (combo: ComboListItem) => {
    setSelectedCombo(combo);
    setShowDetailModal(true);
  };

  // 2. Fix openEditModal to use Combo type
  const openEditModal = (combo: ComboListItem) => {
    setEditingCombo(comboListItemToCombo(combo));
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowEditModal(false);
    setSelectedCombo(null);
    setEditingCombo(null);
  };

  // 3. Add addProductToEdit handler
  const addProductToEdit = (product: Product) => {
    if (!editingCombo) return;
    setEditingCombo((prev) => {
      if (!prev) return prev;
      // Avoid duplicates
      if (prev.items?.some((p) => p.id === product.id)) return prev;
      return {
        ...prev,
        items: [...prev?.items, { ...product, quantity: 1, sku: product.sku }],
      };
    });
  };

  // 4. Fix updateProductQuantity and removeProductFromEdit to use products
  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (!editingCombo) return;
    if (editingCombo.items.some((item) => item.id === productId)) return;

    setEditingCombo((prev) => ({
      ...prev!,
      items: prev!.items.map((product) =>
        String(product.id) === productId
          ? { ...product, quantity: Math.max(1, newQuantity) }
          : product
      ),
    }));
  };
  const removeProductFromEdit = (sku: string) => {
    if (!editingCombo) return;
    setEditingCombo((prev) => ({
      ...prev!,
      items: prev!.items.filter((product) => String(product.sku) !== sku),
    }));
  };

  // 5. Fix calculateEditTotal to use products
  const calculateEditTotal = () => {
    if (!editingCombo) return 0;
    return editingCombo.items?.reduce(
      (total, product) => total + product.price * (product.quantity || 1),
      0
    );
  };

  // 6. Fix saveComboChanges to always update ComboListItem[]
  const saveComboChanges = async () => {
    if (!editingCombo) return;
    try {
      let newComboListItem: ComboListItem;
      if (!editingCombo.id) {
        const payload: ComboCreatePayload = {
          combo_id: "",
          created_by: "admin",
          items: editingCombo.products.map((product) => ({
            category: product.category,
            name: product.name,
            originalPrice: product.price,
            rating_avg: 0,
            sku: String(product.id),
            price: product.price,
          })),
          name: editingCombo.name,
          note: editingCombo.note || "",
          status: editingCombo.status,
        };
        const created = await upsertCombo(payload);
        // Convert response to ComboListItem if needed
        newComboListItem = {
          id: created.id,
          name: created.name,
          note: created.note || "",
          status: created.status,
          createdAt: created.createdAt || new Date().toISOString(),
          createdBy: created.createdBy || "admin",
          items: payload.items,
        };
        setCombos((prev) => [...prev, newComboListItem]);
      } else {
        // Update
        delete editingCombo.totalValue;
        await updateCombo(String(editingCombo.id), {
          ...editingCombo,
          items: editingCombo.items.map((product) => ({
            category: product.category,
            name: product.name,
            originalPrice: product.price,
            rating_avg: 0,
            sku: String(product.sku),
            price: product.price,
          })),
        });

        // setCombos((prev) =>
        //   prev.map((combo) => (combo.id === newComboListItem.id ? newComboListItem : combo))
        // );
      }
      fetchCombos()
        .then((data) => setCombos(data))
        .catch(() => {});

      toast.success("Combo đã được cập nhật thành công!");

      closeModals();
    } catch {
      // handle error
    }
  };

  const closeDetailModal = () => {
    setSelectedCombo(null);
    setShowDetailModal(false);
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
                <option value="inactive">Tạm dừng</option>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ghi chú</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Ngày tạo
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCombos.map((combo) => (
                <tr key={combo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{combo.name}</h3>
                      <div className="text-sm text-gray-600">
                        {combo.items?.map((product, index) => (
                          <span key={product.sku}>
                            {product.name}
                            {index < combo.items?.length - 1 && " + "}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{combo.note}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">{getStatusBadge(combo.status)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{formatDate(combo.created_at)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(combo)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
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
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết Combo</h2>
              <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="font-semibold">Tên combo:</span> {selectedCombo.name}
              </div>
              <div>
                <span className="font-semibold">Ghi chú:</span> {selectedCombo.note}
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {getStatusBadge(selectedCombo.status)}
              </div>
              <div>
                <span className="font-semibold">Ngày tạo:</span>{" "}
                {formatDate(selectedCombo.created_at)}
              </div>
              <div>
                <span className="font-semibold">Người tạo:</span> {selectedCombo.createdBy}
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
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
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
                      onChange={(e) =>
                        setEditingCombo((prev) => ({ ...prev!, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={editingCombo.note || ""}
                      onChange={(e) =>
                        setEditingCombo((prev) => ({ ...prev!, note: e.target.value }))
                      }
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
                      onChange={(e) =>
                        setEditingCombo((prev) => ({
                          ...prev!,
                          status: e.target.value as "active" | "inactive",
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Thêm sản phẩm</h4>
                    <ProductSearchSelect
                      products={products}
                      selectedProducts={editingCombo.products}
                      onAddProduct={addProductToEdit}
                      formatPrice={formatPrice}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Sản phẩm trong combo</h4>
                    <div className="space-y-3">
                      {editingCombo?.items?.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{product.name}</h5>
                            <p className="text-sm text-gray-600">
                              {product.category} • {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <button
                              onClick={() =>
                                updateProductQuantity(
                                  String(product.id),
                                  (product.quantity || 1) - 1
                                )
                              }
                              className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {product.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                updateProductQuantity(
                                  String(product.id),
                                  (product.quantity || 1) + 1
                                )
                              }
                              className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeProductFromEdit(product.sku)}
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
                    <div className="space-y-3">
                      <div className="border-gray-200 pt-3">
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
