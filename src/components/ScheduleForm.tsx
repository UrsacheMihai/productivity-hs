import React, { useState, useEffect } from 'react';
import { ScheduleItem, useScheduleStore } from '../store/scheduleStore';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: ScheduleItem | null;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ isOpen, onClose, editItem }) => {
  const { addScheduleItem, updateScheduleItem } = useScheduleStore();
  
  const [className, setClassName] = useState('');
  const [room, setRoom] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday default
  const [hour, setHour] = useState(0); // 7:00 default
  const [color, setColor] = useState('#e0f2fe'); // sky-100 default
  const [icon, setIcon] = useState<string | null>(null);
  
  useEffect(() => {
    if (editItem) {
      setClassName(editItem.class_name);
      setRoom(editItem.room);
      setDayOfWeek(editItem.day_of_week);
      setHour(editItem.hour);
      setColor(editItem.color);
      setIcon(editItem.icon);
    } else {
      // Default values for new item
      setClassName('');
      setRoom('');
      setDayOfWeek(1);
      setHour(0);
      setColor('#e0f2fe');
      setIcon(null);
    }
  }, [editItem]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      class_name: className,
      room,
      day_of_week: dayOfWeek,
      hour,
      color,
      icon,
    };
    
    if (editItem) {
      await updateScheduleItem(editItem.id, itemData);
    } else {
      await addScheduleItem(itemData);
    }
    
    onClose();
  };
  
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
  
  const colorOptions = [
    '#e0f2fe', // sky-100
    '#dbeafe', // blue-100
    '#ede9fe', // violet-100
    '#fae8ff', // purple-100
    '#fce7f3', // pink-100
    '#fee2e2', // red-100
    '#ffedd5', // orange-100
    '#fef3c7', // amber-100
    '#ecfccb', // lime-100
    '#d1fae5', // emerald-100
  ];
  
  // Common icons for classes
  const iconOptions = [
    { name: 'BookOpen', component: Icons.BookOpen },
    { name: 'Calculator', component: Icons.Calculator },
    { name: 'Atom', component: Icons.Atom },
    { name: 'Globe', component: Icons.Globe },
    { name: 'Dumbbell', component: Icons.Dumbbell },
    { name: 'Palette', component: Icons.Palette },
    { name: 'Music', component: Icons.Music },
    { name: 'Code', component: Icons.Code },
    { name: 'Building', component: Icons.Building },
    { name: 'Microscope', component: Icons.Microscope },
    { name: 'Pencil', component: Icons.Pencil },
    { name: 'Languages', component: Icons.Languages },
  ];
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {editItem ? 'Edit Class' : 'Add Class'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room *
            </label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Day
              </label>
              <select
                id="day"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                {days.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="hour" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <select
                id="hour"
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                {hours.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === c ? 'border-indigo-500 dark:border-indigo-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIcon(null)}
                className={`w-10 h-10 flex items-center justify-center rounded-md border-2 ${
                  icon === null ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-label="No icon"
              >
                <X size={18} />
              </button>
              
              {iconOptions.map((iconOption) => (
                <button
                  key={iconOption.name}
                  type="button"
                  onClick={() => setIcon(iconOption.name)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md border-2 ${
                    icon === iconOption.name ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-label={`Select ${iconOption.name} icon`}
                >
                  <iconOption.component size={18} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editItem ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ScheduleForm;