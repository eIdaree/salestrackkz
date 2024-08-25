import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { useAuth } from './auth/authContext';
import { observer } from 'mobx-react-lite';
import Sidebar from './layout/Sidebar';
import Dashboard from './layout/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import WorkerManagement from './components/worker/WorkerManagenent';
import { ToastContainer } from 'react-toastify';
import { useContext, useEffect } from 'react';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from './redux/store';
import { Context } from './main';
import Page404 from './pages/Page404';
import WorkerDetailPage from './components/worker/workerDetailPage';


// Созвоны с бэком
// Дописать продукт
// Исправление фонта
// Написать телега и ватсап чекер 


function App() {

  // const dispatch = useDispatch();
  const {store} = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token') && store.isAuth == true) {
        store.checkAuth()
    }
}, [store.user])
  console.log(store.isAuth)
if (store.isLoading) {
  return <div>Загрузка...</div>
}

if (!store.isAuth) {
  return (
      <Routes>
        <Route path='*' element={<Page404/>}></Route>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
  );
}
  // const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  // const user = useSelector((state: RootState) => state.auth.user);

  // useEffect(() => {
  //   const unsubscribe = ((user: IUser) => {
  //     dispatch(setAuth(true));
  //     dispatch(setUser(user));
  //   });

  //   unsubscribe();
  // }, []);

  const handleLogout = async () => {
    try {
      store.logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    console.log('work')
  };

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar onLogout={handleLogout}/> 
        <div className="flex-1 p-4 bg-gray-200 ">
          <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workers" element={<WorkerManagement />} />
                <Route path="/workers/:id" element={<WorkerDetailPage/>}></Route>
                <Route path="/settings" element ={<Settings/>}/>
                <Route path="/profile" element = {<Profile/>}/>
                <Route path="*" element={<Navigate to="/" />} />        
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default observer(App);