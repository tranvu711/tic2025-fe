import React, { useState } from 'react';
import { Plus, Minus, Settings, Target, Percent, Package } from 'lucide-react';
import type { ComboRule, RuleCondition, RuleAction } from '../types';

const ComboRuleBuilder: React.FC = () => {
  const [rules, setRules] = useState<ComboRule[]>([
    {
      id: '1',
      name: 'Combo Smartphone + Accessory',
      description: 'Tự động tạo combo khi có smartphone và phụ kiện',
      conditions: [
        { type: 'category', operator: 'equals', value: 'Smartphone' },
        { type: 'category', operator: 'equals', value: 'Accessory' }
      ],
      actions: [
        { type: 'discount_percentage', value: 15 }
      ],
      isActive: true
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ComboRule>>({
    name: '',
    description: '',
    conditions: [],
    actions: [],
    isActive: true
  });

  const conditionTypes = [
    { value: 'category', label: 'Danh mục sản phẩm' },
    { value: 'price_range', label: 'Khoảng giá' },
    { value: 'stock_level', label: 'Mức tồn kho' },
    { value: 'popularity', label: 'Độ phổ biến' }
  ];

  const operators = [
    { value: 'equals', label: 'Bằng' },
    { value: 'greater_than', label: 'Lớn hơn' },
    { value: 'less_than', label: 'Nhỏ hơn' },
    { value: 'contains', label: 'Chứa' }
  ];

  const actionTypes = [
    { value: 'discount_percentage', label: 'Giảm giá theo %' },
    { value: 'discount_fixed', label: 'Giảm giá cố định' },
    { value: 'bundle_size', label: 'Kích thước combo' }
  ];

  const addCondition = () => {
    if (newRule.conditions) {
      setNewRule({
        ...newRule,
        conditions: [...newRule.conditions, { type: 'category', operator: 'equals', value: '' }]
      });
    }
  };

  const addAction = () => {
    if (newRule.actions) {
      setNewRule({
        ...newRule,
        actions: [...newRule.actions, { type: 'discount_percentage', value: 0 }]
      });
    }
  };

  const removeCondition = (index: number) => {
    if (newRule.conditions) {
      setNewRule({
        ...newRule,
        conditions: newRule.conditions.filter((_, i) => i !== index)
      });
    }
  };

  const removeAction = (index: number) => {
    if (newRule.actions) {
      setNewRule({
        ...newRule,
        actions: newRule.actions.filter((_, i) => i !== index)
      });
    }
  };

  const updateCondition = (index: number, field: keyof RuleCondition, value: any) => {
    if (newRule.conditions) {
      const updatedConditions = [...newRule.conditions];
      updatedConditions[index] = { ...updatedConditions[index], [field]: value };
      setNewRule({ ...newRule, conditions: updatedConditions });
    }
  };

  const updateAction = (index: number, field: keyof RuleAction, value: any) => {
    if (newRule.actions) {
      const updatedActions = [...newRule.actions];
      updatedActions[index] = { ...updatedActions[index], [field]: value };
      setNewRule({ ...newRule, actions: updatedActions });
    }
  };

  const saveRule = () => {
    if (newRule.name && newRule.conditions && newRule.actions) {
      const rule: ComboRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description || '',
        conditions: newRule.conditions,
        actions: newRule.actions,
        isActive: newRule.isActive || true
      };
      setRules([...rules, rule]);
      setNewRule({ name: '', description: '', conditions: [], actions: [], isActive: true });
      setIsCreating(false);
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quy tắc tự động tạo combo</h3>
          <p className="text-gray-600">Thiết lập quy tắc để hệ thống tự động đề xuất combo</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo quy tắc mới</span>
        </button>
      </div>

      {/* Existing Rules */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{rule.name}</h4>
                <p className="text-sm text-gray-600">{rule.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {rule.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Điều kiện:</h5>
                <div className="space-y-1">
                  {rule.conditions.map((condition, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                      {conditionTypes.find(t => t.value === condition.type)?.label} {' '}
                      {operators.find(o => o.value === condition.operator)?.label} {' '}
                      <span className="font-medium">{condition.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Hành động:</h5>
                <div className="space-y-1">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-blue-50 rounded px-2 py-1">
                      {actionTypes.find(t => t.value === action.type)?.label}: {' '}
                      <span className="font-medium">{action.value}
                        {action.type === 'discount_percentage' ? '%' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Rule Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo quy tắc mới</h3>

              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên quy tắc</label>
                  <input
                    type="text"
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên quy tắc..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={newRule.description || ''}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Mô tả quy tắc..."
                  />
                </div>
              </div>

              {/* Conditions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Điều kiện</h4>
                  <button
                    onClick={addCondition}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm điều kiện</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {newRule.conditions?.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={condition.type}
                        onChange={(e) => updateCondition(index, 'type', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {conditionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {operators.map(op => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Giá trị..."
                      />
                      <button
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Hành động</h4>
                  <button
                    onClick={addAction}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm hành động</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {newRule.actions?.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                      <select
                        value={action.type}
                        onChange={(e) => updateAction(index, 'type', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {actionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={action.value}
                        onChange={(e) => updateAction(index, 'value', Number(e.target.value))}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Giá trị..."
                      />
                      <button
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={saveRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu quy tắc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboRuleBuilder;