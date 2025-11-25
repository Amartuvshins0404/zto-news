import React from 'react';
import { TrendingUp, Cloud, Sun, CloudRain, Snowflake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockData, WeatherData } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useTranslation } from '../services/translationService';

// --- Weather Widget ---
export const WeatherWidget: React.FC<{ data: WeatherData }> = ({ data }) => {
  const { t } = useTranslation();
  const getIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'Rain': return <CloudRain className="w-8 h-8 text-primary-500" />;
      case 'Snow': return <Snowflake className="w-8 h-8 text-cyan-500" />;
      default: return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-primary-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('weather_city')}</p>
          <p className="text-2xl font-bold text-primary-900 dark:text-white">{data.temp}°C</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{data.condition}</p>
        </div>
        {getIcon(data.condition)}
      </div>
    </div>
  );
};

// --- Stock Widget ---
const mockChartData = [
    {v: 100}, {v: 102}, {v: 101}, {v: 105}, {v: 104}, {v: 108}, {v: 107}, {v: 110}
];

export const StockWidget: React.FC<{ stocks: StockData[] }> = ({ stocks }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 text-accent mr-2" />
        <h3 className="font-bold text-gray-900 dark:text-white">{t('stock_market')}</h3>
      </div>
      <div className="space-y-4">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{stock.symbol}</p>
              <div className="flex items-center">
                <span className={`text-xs font-medium flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {Math.abs(stock.change)}%
                </span>
              </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">₮{stock.price}</p>
                {/* Micro Chart Visualization */}
                <div className="h-6 w-16">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChartData}>
                            <Line 
                                type="monotone" 
                                dataKey="v" 
                                stroke={stock.change >= 0 ? '#16a34a' : '#dc2626'} 
                                strokeWidth={2} 
                                dot={false} 
                            />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                        </LineChart>
                     </ResponsiveContainer>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};