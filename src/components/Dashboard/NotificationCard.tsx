import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationCardProps {
  type: 'consultation' | 'campaign' | 'content';
  title: string;
  time: string;
  urgent: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ type, title, time, urgent }) => {
  const getIcon = () => {
    switch (type) {
      case 'consultation': return <AlertCircle className="h-5 w-5" />;
      case 'campaign': return <Clock className="h-5 w-5" />;
      case 'content': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getColor = () => {
    if (urgent) return 'text-red-600 bg-red-50 border-red-200';
    switch (type) {
      case 'consultation': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'campaign': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'content': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border ${getColor()}`}>
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
      {urgent && (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          Urgent
        </span>
      )}
    </div>
  );
};

export default NotificationCard;