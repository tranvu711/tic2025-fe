import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const performanceData = [
    { metric: 'Tổng doanh thu từ Combo', value: '₫2.4B', change: '+18.7%', trend: 'up' },
    { metric: 'Số combo được mua', value: '4,187', change: '+12.3%', trend: 'up' },
    { metric: 'Conversion rate trung bình', value: '24.8%', change: '+5.2%', trend: 'up' },
    { metric: 'AOV (Average Order Value)', value: '₫573K', change: '+8.9%', trend: 'up' },
  ];

  const topPerformingCombos = [
    { 
      name: 'Combo Creator Pro', 
      revenue: '₫845M', 
      orders: 1534, 
      conversion: 31.2,
      roi: 28.5
    },
    { 
      name: 'Combo Gia đình Plus', 
      revenue: '₫672M', 
      orders: 1247, 
      conversion: 28.5,
      roi: 24.7
    },
    { 
      name: 'Combo Sinh viên Smart', 
      revenue: '₫521M', 
      orders: 893, 
      conversion: 25.2,
      roi: 22.1
    },
    { 
      name: 'Combo Văn phòng Pro', 
      revenue: '₫403M', 
      orders: 756, 
      conversion: 22.8,
      roi: 19.8
    }
  ];

  const customerSegments = [
    { segment: 'Gia đình (25-40 tuổi)', preference: 'Combo tiết kiệm, nhiều sản phẩm', avgSpend: '₫780K', frequency: 2.3 },
    { segment: 'Sinh viên (18-25 tuổi)', preference: 'Combo tech, giá rẻ', avgSpend: '₫450K', frequency: 1.8 },
    { segment: 'Doanh nghiệp', preference: 'Combo văn phòng, chất lượng cao', avgSpend: '₫1.2M', frequency: 3.1 },
    { segment: 'Creator/Designer', preference: 'Combo chuyên nghiệp, hiệu năng cao', avgSpend: '₫950K', frequency: 2.7 }
  ];

  const conversionFunnel = [
    { stage: 'Xem combo', users: 12847, rate: 100 },
    { stage: 'Click xem chi tiết', users: 8934, rate: 69.5 },
    { stage: 'Thêm vào giỏ', users: 4892, rate: 38.1 },
    { stage: 'Thanh toán', users: 3187, rate: 24.8 },
  ];

  const timeRanges = [
    { value: '7days', label: '7 ngày qua' },
    { value: '30days', label: '30 ngày qua' },
    { value: '3months', label: '3 tháng qua' },
    { value: '6months', label: '6 tháng qua' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
          <p className="text-gray-600 mt-2">Đánh giá hiệu quả và tối ưu hóa chiến lược combo</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                {index === 0 && <DollarSign className="w-5 h-5" />}
                {index === 1 && <Users className="w-5 h-5" />}
                {index === 2 && <Target className="w-5 h-5" />}
                {index === 3 && <TrendingUp className="w-5 h-5" />}
              </div>
              <span className="text-green-600 text-sm font-medium">{item.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h3>
            <p className="text-sm text-gray-600">{item.metric}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Combos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Combo hiệu quả</h3>
          <div className="space-y-4">
            {topPerformingCombos.map((combo, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{combo.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>{combo.orders} đơn</span>
                    <span>•</span>
                    <span>CV: {combo.conversion}%</span>
                    <span>•</span>
                    <span>ROI: {combo.roi}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{combo.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Phễu chuyển đổi</h3>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{stage.users.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">({stage.rate}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stage.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Segment Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Phân tích nhóm khách hàng</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nhóm khách hàng</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sở thích</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Chi tiêu TB</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tần suất mua</th>
              </tr>
            </thead>
            <tbody>
              {customerSegments.map((segment, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{segment.segment}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">{segment.preference}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{segment.avgSpend}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">{segment.frequency} lần/tháng</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gợi ý tối ưu hóa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Cải thiện Conversion Rate:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Tối ưu hóa giá combo cho nhóm "Sinh viên" (hiện tại: 25.2%)</li>
              <li>• Thêm tính năng so sánh sản phẩm trong combo</li>
              <li>• Cải thiện UX trang chi tiết combo</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Tăng doanh thu:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Tạo combo cao cấp cho nhóm "Creator/Designer"</li>
              <li>• Cross-sell combo phụ kiện với sản phẩm chính</li>
              <li>• Áp dụng dynamic pricing theo demand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;