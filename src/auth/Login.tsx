import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../main';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const {store} = useContext(Context);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const {email,password} = data
      const phone_number = ''
      const requ = await store.login(email,password,phone_number)
      
      if(requ){
        toast.success('Пользователь успешно зашел!');
        setTimeout(() => {
          navigate('/');
        }, 1500); 
      } else{       toast.error('Логин или пароль неправильно.');}
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-24 w-24" />
        </div>
        <h2 className="text-2xl font-bold text-center">Авторизация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Электронная почта
            </label>
            <input
              type="text"
              id="email"
              {...register('email', { required: 'Нужно ввести электронную почту' })}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Нужно ввести электронную почту"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Нужно ввести пароль' })}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Ввести пароль"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Войти
          </button>
          <p>Если у вас нету аккаунта, то можете <Link to='/register' className='text-blue-60'> Зарегистрироваться </Link></p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
