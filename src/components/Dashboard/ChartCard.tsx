import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  data: any;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data }) => {
  // Nilai tertinggi dari semua dataset untuk scaling
  const maxValue = Math.max(...data.datasets.flatMap((d: any) => d.data));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
        {title}
      </h3>

      <div className="h-64 flex items-end justify-between space-x-2">
        {data.labels.map((label: string, index: number) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex flex-col justify-end w-full h-full">
              {data.datasets.map((dataset: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full mb-1 rounded-t"
                  style={{
                    height: `${(dataset.data[index] / maxValue) * 100}%`,
                    backgroundColor: dataset.backgroundColor,
                  }}
                  title={`${dataset.label}: ${dataset.data[index]}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 mt-2">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-4 flex-wrap">
        {data.datasets.map((dataset: any, idx: number) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dataset.backgroundColor }}
            ></div>
            <span className="text-sm text-gray-600">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCard;
