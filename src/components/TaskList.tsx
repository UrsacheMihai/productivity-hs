import React, { useState } from 'react';
import { Task, useTaskStore } from '../store/taskStore';
import { CheckCircle, Circle, Clock, Star, Trash, Edit, ChevronDown, ChevronUp, Bell, BellOff } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useTaskStore();
  const [expanded, setExpanded] = useState(false);
  
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-2 p-3 rounded-lg shadow-sm ${task.is_completed ? 'opacity-70' : ''}`}
      style={{ backgroundColor: task.color || '#ffffff', borderLeft: task.is_important ? '4px solid #f59e0b' : '' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => toggleTaskCompletion(task.id)}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {task.is_completed ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex-1">
            <p className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800 '}`}>
              {task.title}
            </p>
            
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500 dark:text-gray-400">
              {task.deadline && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(task.deadline), 'MMM d, yyyy')}
                </div>
              )}
              
              {task.send_notification && (
                <div className="flex items-center">
                  <Bell className="h-3 w-3 mr-1" />
                  Notifications on
                </div>
              )}
              
              {hasSubtasks && (
                <div className="flex items-center">
                  <span>{task.subtasks?.filter(t => t.is_completed).length || 0}/{task.subtasks?.length || 0} subtasks</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {task.is_important && <Star className="h-4 w-4 text-amber-500" />}
          
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          >
            <Trash className="h-4 w-4" />
          </button>
          
          {hasSubtasks && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
      
      {hasSubtasks && expanded && (
        <div className="mt-3 pl-8 border-l-2 border-gray-200 dark:border-gray-700">
          {task.subtasks?.map(subtask => (
            <div key={subtask.id} className="flex items-center py-2">
              <button
                onClick={() => toggleTaskCompletion(subtask.id)}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mr-3"
              >
                {subtask.is_completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              
              <span className={`${subtask.is_completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {subtask.title}
              </span>
              
              <div className="ml-auto flex space-x-1">
                <button
                  onClick={() => onEdit(subtask)}
                  className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <Edit className="h-3 w-3" />
                </button>
                
                <button
                  onClick={() => deleteTask(subtask.id)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const TaskList: React.FC<{ onEdit: (task: Task) => void }> = ({ onEdit }) => {
  const { getTasksWithSubtasks } = useTaskStore();
  const tasks = getTasksWithSubtasks();
  
  const importantTasks = tasks.filter(task => task.is_important && !task.is_completed);
  const regularTasks = tasks.filter(task => !task.is_important && !task.is_completed);
  const completedTasks = tasks.filter(task => task.is_completed);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Important Tasks</h2>
        <AnimatePresence>
          {importantTasks.length > 0 ? (
            importantTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={onEdit} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No important tasks</p>
          )}
        </AnimatePresence>
        
        <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-200">Completed Tasks</h2>
        <AnimatePresence>
          {completedTasks.length > 0 ? (
            completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={onEdit} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No completed tasks</p>
          )}
        </AnimatePresence>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Tasks</h2>
        <AnimatePresence>
          {regularTasks.length > 0 ? (
            regularTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={onEdit} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No tasks</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;