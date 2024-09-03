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

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { store } = useContext(Context);
  
  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!store.isAuth) {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.checkAuth().finally(() => {
      setIsLoaded(true);
    });
  }, [store]);

  if (!isLoaded) {
    return <div>Загрузка...</div>;
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
      <div className="flex h-screen dark:bg-slate-900">
        {store.isAuth && <Sidebar onLogout={handleLogout} />}
        <div className="flex-1 pt-4 p-4 bg-gray-200 dark:bg-slate-800">
          <Routes>
            {/* Роуты для неаутентифицированных пользователей */}
            {!store.isAuth && (
              <>
                <Route path="*" element={<Page404 />} />
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            )}

            {/* Роуты для аутентифицированных пользователей */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/workers" element={<ProtectedRoute element={<WorkerManagement />} />} />
            <Route path="/workers/:id" element={<ProtectedRoute element={<WorkerDetailPage />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            
            {/* Страница 404 */}
            <Route path="*" element={<Page404 />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default observer(App);
