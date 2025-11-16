import React from 'react';
import { Clock, CreditCard as Edit, Trash2 } from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  platform: string;
  type: string;
  time: string;
  status: 'scheduled' | 'draft' | 'published';
}

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  viewMode: 'month' | 'week' | 'day';
  onDateClick: (date: Date) => void;
  onEventDelete: (eventId: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  events,
  viewMode,
  onDateClick,
  onEventDelete,
}) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-pink-100 text-pink-800';
      case 'TikTok': return 'bg-gray-100 text-gray-800';
      case 'Facebook': return 'bg-blue-100 text-blue-800';
      case 'LinkedIn': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  if (viewMode === 'month') {
    return (
      <div className="p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day && day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-24 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !day ? 'bg-gray-100' : ''
                }`}
                onClick={() => day && onDateClick(day)}
              >
                {day && (
                  <>
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600 font-bold' : 'text-gray-800'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${getPlatformColor(event.platform)}`}
                          title={event.title}
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week/Day view for mobile
  return (
    <div className="p-4">
      <div className="space-y-3">
        {events
          .filter(event => {
            const eventDate = event.date;
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
          })
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((event) => (
            <div key={event.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{event.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{event.date.toLocaleDateString('id-ID')} - {event.time}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => onEventDelete(event.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlatformColor(event.platform)}`}>
                  {event.platform}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {event.type}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Calendar;