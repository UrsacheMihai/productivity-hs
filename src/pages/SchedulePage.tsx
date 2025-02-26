import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ScheduleGrid from '../components/ScheduleGrid';
import ScheduleForm from '../components/ScheduleForm';
import { ScheduleItem } from '../store/scheduleStore';

const SchedulePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<ScheduleItem | null>(null);
  
  const handleOpenForm = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };
  
  const handleEditItem = (item: ScheduleItem | null) => {
    setEditItem(item);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditItem(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Class Schedule</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenForm}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add Class
        </motion.button>
      </motion.div>
      
      <ScheduleGrid onEdit={handleEditItem} />
      
      <ScheduleForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        editItem={editItem} 
      />
    </div>
  );
};

export default SchedulePage;