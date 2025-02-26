import { Link } from 'react-router-dom';
import { Calendar, CheckSquare, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { useScheduleStore } from '../store/scheduleStore';

const HomePage = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();
  const { schedule } = useScheduleStore();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const todaySchedule = schedule.filter((item) => item.day_of_week === dayOfWeek);

  const importantTasks = tasks.filter((task) => task.is_important && !task.is_completed);
  const upcomingTasks = tasks
      .filter((task) => !task.is_completed && task.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
        >
          
        </motion.div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Today's Schedule */}
          <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5 bg-indigo-600 dark:bg-indigo-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Today's Schedule
                </h2>
                <Link to="/schedule" className="text-indigo-100 hover:text-white text-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-5">
              {todaySchedule.length > 0 ? (
                  <div className="space-y-3">
                    {todaySchedule
                        .sort((a, b) => a.hour - b.hour)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center p-3 rounded-lg"
                                style={{ backgroundColor: item.color || '#f3f4f6' }}
                            >
                              <div className="flex-shrink-0 w-12 text-center">
                        <span className="font-medium text-gray-800">
                          {item.hour + 7}:00
                        </span>
                              </div>
                              <div className="ml-4">
                                <p className="font-medium text-gray-800">{item.class_name}</p>
                                <p className="text-sm text-gray-600">Room: {item.room}</p>
                              </div>
                            </div>
                        ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No classes scheduled for today</p>
                    <Link
                        to="/schedule"
                        className="mt-3 inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium"
                    >
                      Manage Schedule
                    </Link>
                  </div>
              )}
            </div>
          </motion.div>

          {/* Important Tasks */}
          <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5 bg-amber-500 dark:bg-amber-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <CheckSquare className="mr-2" size={20} />
                  Important Tasks
                </h2>
                <Link to="/tasks" className="text-amber-100 hover:text-white text-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-5">
              {importantTasks.length > 0 ? (
                  <div className="space-y-3">
                    {importantTasks.slice(0, 3).map((task) => (
                        <div
                            key={task.id}
                            className="p-3 rounded-lg flex items-center"
                            style={{ backgroundColor: task.color || '#f3f4f6', borderLeft: '4px solid #f59e0b' }}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{task.title}</p>
                            {task.deadline && (
                                <p className="text-xs text-gray-500">
                                  Due: {new Date(task.deadline).toLocaleDateString()}
                                </p>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No important tasks</p>
                    <Link
                        to="/tasks"
                        className="mt-3 inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-md text-sm font-medium"
                    >
                      Add Tasks
                    </Link>
                  </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:col-span-2"
          >
            <div className="p-5 bg-emerald-500 dark:bg-emerald-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <BookOpen className="mr-2" size={20} />
                  Upcoming Tasks
                </h2>
                <Link to="/tasks" className="text-emerald-100 hover:text-white text-sm">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-5">
              {upcomingTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {upcomingTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: task.color || '#f3f4f6' }}
                        >
                          <p className="font-medium text-gray-800">{task.title}</p>
                          {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                          )}
                          {task.deadline && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Due: {new Date(task.deadline).toLocaleDateString()}
                              </p>
                          )}
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No upcoming tasks</p>
                    <Link
                        to="/tasks"
                        className="mt-3 inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-md text-sm font-medium"
                    >
                      Add Tasks
                    </Link>
                  </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
  );
};

export default HomePage;
