import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Sidebar from './layout/Sidebar';
import Dashboard from './layout/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import WorkerManagement from './components/worker/WorkerManagenent';
import { ToastContainer } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { Context } from './main';
import Page404 from './pages/Page404';
import WorkerDetailPage from './components/worker/workerDetailPage';

function App() {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth().finally(() => {
        setIsLoaded(true); 
      });
    } else {
      setIsLoaded(true);
    }
  }, [store]);

  if (!isLoaded) {
    return <div>Загрузка...</div>;
  }

  if (!store.isAuth) {
    return (
      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  const handleLogout = async () => {
    try {
      await store.logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 p-4 bg-gray-200">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workers" element={<WorkerManagement />} />
            <Route path="/workers/:id" element={<WorkerDetailPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default observer(App);
