import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // No need to import Router here
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import TasksPage from './pages/TasksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';
import { useTaskStore } from './store/taskStore';
import { useScheduleStore } from './store/scheduleStore';
import { requestNotificationPermission } from './store/taskStore';

function App() {
    const { initialize, user, loading, theme } = useAuthStore();
    const { fetchTasks } = useTaskStore();
    const { fetchSchedule } = useScheduleStore();
    const [notificationRequested, setNotificationRequested] = useState(false);

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (user) {
            fetchTasks();
            fetchSchedule();

            if (!notificationRequested) {
                requestNotificationPermission();
                setNotificationRequested(true);
            }
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${theme}`}>
            {user ? (
                <>
                    <div className="pb-16 md:pt-16 md:pb-0">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/schedule" element={<SchedulePage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                        </Routes>
                    </div>
                    <Navigation />
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<LoginPage />} />
                </Routes>
            )}
            <Toaster position="top-right" />
            <footer className="text-center py-4 mt-8">
                <p className="text-sm text-gray-600">Made by Ursache Mihai</p>
            </footer>
        </div>
    );
}

export default App;
