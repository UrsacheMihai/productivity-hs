import React, { useState, useEffect } from 'react';
import { Task, useTaskStore } from '../store/taskStore';
import { X, Plus, Star, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTask?: Task | null;
  parentTask?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, editTask, parentTask }) => {
  const { addTask, updateTask, tasks } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [isImportant, setIsImportant] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);
  
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setDeadline(editTask.deadline ? new Date(editTask.deadline).toISOString().split('T')[0] : '');
      setColor(editTask.color);
      setIsImportant(editTask.is_important);
      setSendNotification(editTask.send_notification);
    } else {
      // Default values for new task
      setTitle('');
      setDescription('');
      setDeadline('');
      setColor('#ffffff');
      setIsImportant(false);
      setSendNotification(false);
    }
  }, [editTask]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description: description || null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      color,
      is_important: isImportant,
      is_completed: editTask ? editTask.is_completed : false,
      send_notification: sendNotification,
      parent_id: parentTask ? parentTask.id : (editTask?.parent_id || null),
    };
    
    if (editTask) {
      await updateTask(editTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    
    onClose();
  };
  
  const colorOptions = [
    '#ffffff', // white
    '#0055ff', // gray-100
    '#ff0000', // red-100
    '#ff9200', // orange-100
    '#ffcc00', // amber-100
    '#aaff00', // lime-100
    '#00ff7e', // emerald-100
    '#e0f2fe', // sky-100
    '#dbeafe', // blue-100
    '#ede9fe', // violet-100
    '#fae8ff', // purple-100
    '#fce7f3', // pink-100
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
            {editTask ? 'Edit Task' : parentTask ? 'Add Subtask' : 'Add Task'}
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
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
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="important" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Important
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notification"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="notification" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Notifications
              </label>
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
              {editTask ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;