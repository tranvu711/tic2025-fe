import { DollarSign, Package, TrendingUp } from "lucide-react";
import React from "react";
import type { ComboPreviewProps } from "../types";

const ComboPreview: React.FC<ComboPreviewProps> = ({
  name,
  note,
  products,
  originalPrice,
  salePrice,
  discount,
  targetSegment,
  expectedConversion,
  expectedROI,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getSegmentName = (segment: string) => {
    const segments: { [key: string]: string } = {
      all: "Tất cả khách hàng",
      family: "Gia đình",
      student: "Sinh viên",
      professional: "Doanh nghiệp",
      creator: "Creator/Designer",
    };
    return segments[segment] || segment;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{getSegmentName(targetSegment)}</p>
        </div>
      </div>

      {/* Description */}
      {note && <p className="text-sm text-gray-600 mb-4">{note}</p>}

      {/* Products */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-gray-900">Sản phẩm bao gồm:</h4>
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {product.name} {product.quantity > 1 && `x${product.quantity}`}
            </span>
            <span className="text-gray-500">{formatPrice(product.price * product.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Giá gốc:</span>
          <span className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Giảm giá:</span>
          <span className="text-sm text-red-600">-{discount}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">Giá bán:</span>
          <span className="text-xl font-bold text-blue-600">{formatPrice(salePrice)}</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">Conversion</span>
          </div>
          <p className="text-lg font-bold text-green-900">{expectedConversion}%</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-purple-700">ROI</span>
          </div>
          <p className="text-lg font-bold text-purple-900">+{expectedROI}%</p>
        </div>
      </div>
    </div>
  );
};

export default ComboPreview;
