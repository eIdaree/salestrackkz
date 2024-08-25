import { useForm, SubmitHandler } from 'react-hook-form';
import logo from '../assets/logo.svg';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../main';

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterFormData>();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const { email, password, first_name, last_name, phoneNumber } = data;
    const phone_number = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber;
    
    try {
      store.registration(email, password, phone_number, first_name, last_name);
      console.log('User registered');
      navigate('/');
    } catch (err) {
      setSubmitError("Failed to register");
    }
  };

  const handleEmailChange = () => {
    if (!showPasswordFields) {
      setShowPasswordFields(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-24 w-24" />
        </div>
        <h2 className="text-2xl font-bold text-center">Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              type="text"
              id="first_name"
              {...register('first_name', { required: 'Нужно ввести имя' })}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Ваше имя"
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Фамилия
            </label>
            <input
              type="text"
              id="last_name"
              {...register('last_name', { required: 'Нужно ввести фамилию' })}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Ваша фамилия"
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Электронная почта
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Нужно ввести электронную почту' })}
              onBlur={handleEmailChange}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Ваша электронная почта"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          {showPasswordFields && (
            <>
              <div className="fade-in">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register('phoneNumber', {
                    required: 'Нужно ввести номер телефона',
                    pattern: {
                      value: /^\+?\d{11,12}$/,
                      message: 'Номер телефона должен содержать от 11 до 12 цифр и начинаться с +'
                    }
                  })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  placeholder="+77054587878"
                  onKeyPress={(e) => {
                    if (!/[0-9+]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
              </div>
              <div className="fade-in">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', { required: 'Нужно ввести пароль' })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  placeholder="Ваш пароль"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Регистрировать
          </button>
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <p>Если у вас уже аккаунт, то можете <Link to='/' className='text-blue-60'>Авторизоваться</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
