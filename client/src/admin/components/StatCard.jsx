import React from 'react';

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  color = 'blue',
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};