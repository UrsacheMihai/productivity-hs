import React, { useState } from 'react';
import { ScheduleItem, useScheduleStore } from '../store/scheduleStore';
import { Edit, Trash, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ScheduleGridProps {
  onEdit: (item: ScheduleItem | null) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ onEdit }) => {
  const { schedule, deleteScheduleItem } = useScheduleStore();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const days = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 0, label: 'Sunday' },
    { value: 6, label: 'Saturday' },
  ];

  const hours = Array.from({ length: 8 }, (_, i) => ({
    value: i,
    label: `${i + 7}:00`,
  }));

  // Filter schedule items for the currently selected day.
  const filteredSchedule = schedule.filter(
    (item) => item.day_of_week === selectedDay
  );

  // Returns the appropriate icon component based on the name.
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return null;
    // @ts-ignore - dynamic icon access
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={18} /> : null;
  };

  return (
    <div className="mt-4">
      {/* Day Selector */}
      <div className="flex overflow-x-auto pb-2 mb-4">
        {days.map((day) => (
          <button
            key={day.value}
            className={`px-4 py-2 mr-2 rounded ${
              selectedDay === day.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedDay(day.value)}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-8 gap-4">
        {hours.map((hour) => {
          // Find the schedule item (if any) that matches this hour slot.
          const item = filteredSchedule.find(
            (item) => item.hour === hour.value
          );

          return (
            <div
              key={hour.value}
              className="border rounded p-2 min-h-[80px] relative"
            >
              {/* Hour label */}
              <div className="absolute top-1 left-1 text-xs text-gray-500">
                {hour.label}
              </div>

              <AnimatePresence>
                {item && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-4 flex flex-col items-start"
                  >
                    <div className="flex items-center mb-1">
                      {getIconComponent(item.icon)}
                      <span className="ml-1 font-semibold">{item.title}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteScheduleItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* If there is no schedule item for this hour, show an "Add" button */}
              {!item && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() =>
                      onEdit({
                        id: 0, // assuming 0 or another temporary id for a new item
                        day_of_week: selectedDay,
                        hour: hour.value,
                        title: '',
                        icon: null,
                      })
                    }
                    className="text-green-500 hover:text-green-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleGrid;
