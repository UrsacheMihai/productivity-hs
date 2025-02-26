import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task } from '../store/taskStore';

const TasksPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  
  const handleOpenForm = () => {
    setEditTask(null);
    setParentTask(null);
    setIsFormOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setParentTask(null);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTask(null);
    setParentTask(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenForm}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </motion.button>
      </motion.div>
      
      <TaskList onEdit={handleEditTask} />
      
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        editTask={editTask} 
        parentTask={parentTask} 
      />
    </div>
  );
};

export default TasksPage;