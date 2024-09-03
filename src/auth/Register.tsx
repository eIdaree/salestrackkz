import { useForm, SubmitHandler } from "react-hook-form";
import logo from "../assets/logo.svg";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import { toast } from "react-toastify";

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const { email, password, first_name, last_name, phoneNumber } = data;
    const phone_number = phoneNumber.startsWith("+")
      ? phoneNumber.slice(1)
      : phoneNumber;

    try {
      const request = await store.registration(
        email,
        password,
        phone_number,
        first_name,
        last_name
      );
      
      if (request.success) {
        toast.success("Пользователь зарегистрировался");
        setTimeout(() => {
            navigate("/");
        }, 1500);
      } else {
        if (request.message === 'Уже есть пользователь с такой почтой') {
            setError("email", { type: "manual", message: request.message });
        } else if (request.message === 'Этот номер телефона уже существует') {
            setError("phoneNumber", { type: "manual", message: request.message });
        } else {
            toast.error("Что-то произошло не так");
            setSubmitError(request.message);
        }
    }
    } catch (err: any) {
      toast.error(err);
      setSubmitError("Не получилось зарегистрироваться");
    }
  };

  const handleEmailChange = () => {
    if (!showPasswordFields) {
      setShowPasswordFields(true);
    }
  };
  const textStyle = "block text-sm font-medium text-gray-700 dark:text-white";
  const errorTextStyle = "text-red-500 text-sm";
  const inputTextStyle =
    "w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 dark:text-slate-900 ";
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900 dark:text-white mx-[-1em] mt-[-1em]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg dark:bg-slate-800 dark:text-white">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-24 w-24" />
        </div>
        <h2 className="text-2xl font-bold text-center">Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="first_name" className={`${textStyle}`}>
              Имя
            </label>
            <input
              type="text"
              id="first_name"
              {...register("first_name", { required: "Нужно ввести имя" })}
              className={`${inputTextStyle}`}
              placeholder="Ваше имя"
            />
            {errors.first_name && (
              <p className={`${errorTextStyle}`}>{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className={`${textStyle}`}>
              Фамилия
            </label>
            <input
              type="text"
              id="last_name"
              {...register("last_name", { required: "Нужно ввести фамилию" })}
              className={`${inputTextStyle}`}
              placeholder="Ваша фамилия"
            />
            {errors.last_name && (
              <p className={`${errorTextStyle}`}>{errors.last_name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className={`${textStyle}`}>
              Электронная почта
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Нужно ввести электронную почту",
              })}
              onBlur={handleEmailChange}
              className={`${inputTextStyle}`}
              placeholder="Ваша электронная почта"
            />
            {errors.email && (
              <p className={`${errorTextStyle}`}>{errors.email.message}</p>
            )}
          </div>
          {showPasswordFields && (
            <>
              <div className="fade-in">
                <label htmlFor="phoneNumber" className={`${textStyle}`}>
                  Номер телефона
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Нужно ввести номер телефона",
                    pattern: {
                      value: /^\+?\d{11,12}$/,
                      message:
                        "Номер телефона должен содержать от 11 до 12 цифр и начинаться с +",
                    },
                  })}
                  className={`${inputTextStyle}`}
                  placeholder="+77054587878"
                  onKeyPress={(e) => {
                    if (!/[0-9+]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.phoneNumber && (
                  <p className={`${errorTextStyle}`}>
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="fade-in">
                <label htmlFor="password" className={`${textStyle}`}>
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Нужно ввести пароль",
                    minLength: {
                      value: 8,
                      message: "Пароль должен содержать минимум 8 символов",
                    },
                    maxLength: {
                      value: 20,
                      message: "Пароль не может превышать 20 символов",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                      message: "Пароль слишком простой",
                    },
                  })}
                  placeholder="Пароль"
                  className={`${inputTextStyle}`}
                />
                {errors.password && (
                  <p className={`${errorTextStyle}`}>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className={`${inputTextStyle} bg-blue-600 hover:bg-blue-700 text-white`}
          >
            Регистрировать
          </button>
          {submitError && <p className={`${errorTextStyle}`}>{submitError}</p>}
          <p>
            Если у вас уже аккаунт, то можете{" "}
            <Link to="/" className="text-blue-60">
              Авторизоваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
