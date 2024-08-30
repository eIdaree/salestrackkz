import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type WorkerFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  salary: string;
};

type WorkDay = {
  day: string; 
  startTime: string;
  endTime: string;
};

type WorkScheduleData = {
  work_schedule: WorkDay[];
};

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const AddWorker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, setValue, getValues, formState: { errors }, setError } = useForm<WorkerFormData & WorkScheduleData>();

  const watchedSchedule = watch("work_schedule");

  const handleWorkerSubmit: SubmitHandler<WorkerFormData & WorkScheduleData> = async (data) => {
    try {
      const { first_name, last_name, email, phone_number, salary, work_schedule } = data;
      const phoneNumber = phone_number.startsWith("+7") ? phone_number.slice(2) : phone_number;
      
      // Запрос на добавление сотрудника
      const workerResponse = await axios.post('https://sailau.xyz/api/employee/', {
        first_name,
        last_name,
        phone_number: phoneNumber,
        email,
        salary
      });

      const workerId = workerResponse.data.id; // Получаем ID сотрудника

      // Подготовка данных рабочего графика
      const mappedSchedule = work_schedule.map(day => ({
        week_day: daysOfWeek.indexOf(day.day),
        time_from: day.startTime,
        time_to: day.endTime
      })).filter(day => day.week_day !== -1);

      // Запрос на добавление рабочего графика
      for (const schedule of mappedSchedule) {
        const url = `https://sailau.xyz/api/schedule/?employee_id=${workerId}`;
        await axios.post(url, schedule);
      }

      // Закрытие формы после успешной отправки
      onClose();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.code === 'error-phone-number') {
          setError("phone_number", { type: "manual", message: error.response.data.message });
        }
      } else {
        console.error('Error submitting worker data or schedule:', error);
      }
    }
  };

  const validateEndTime = (startTime: string, endTime: string) => {
    return endTime > startTime || 'End time must be after start time';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Добавить сотрудника</h2>
            <form onSubmit={handleSubmit(() => setStep(2))} className="space-y-4">
              {/* Форма данных сотрудника */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Имя</label>
                <input
                  type="text"
                  placeholder='Имя'
                  {...register('first_name', { required: 'Имя обязательно' })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                <input
                  type="text"
                  placeholder='Фамилия'
                  {...register('last_name', { required: 'Фамилия обязательна' })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Электронная почта</label>
                <input
                  type="email"
                  placeholder='Электронная почта'
                  {...register('email', { required: 'Электронная почта обязательна' })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
                <input
                  type="tel"
                  placeholder='+77756434545'
                  {...register('phone_number', { required: 'Номер телефона обязателен', pattern: {
                    value: /^\+7\d{10}$/,
                    message: "Номер телефона должен содержать от 11 до 12 цифр и начинаться с +7",
                  } })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Зарплата</label>
                <input
                  type="text"
                  {...register('salary', { required: 'Зарплата обязательна', pattern: {
                    value: /^\d+$/,
                    message: 'Использовать только цифры и без пробелов'
                  } })}
                  className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
              </div>
              <button
                type="button"
                onClick={()=>setStep(2)}
                className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Продолжить
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Закрыть
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Рабочие дни</h2>
            <form onSubmit={handleSubmit(handleWorkerSubmit)} className="space-y-4">
              {daysOfWeek.map((day, index) => {
                const isDayChecked = watchedSchedule?.some(schedule => schedule.day === day);
                return (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id={`work_schedule_${day}`}
                      {...register(`work_schedule.${index}.day`)}
                      value={day}
                      className="form-checkbox"
                      checked={isDayChecked}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setValue(`work_schedule.${index}.day`, isChecked ? day : '');
                        if (!isChecked) {
                          setValue(`work_schedule.${index}.startTime`, '');
                          setValue(`work_schedule.${index}.endTime`, '');
                        }
                      }}
                    />
                    <label htmlFor={`work_schedule_${day}`} className="block text-sm font-medium text-gray-700">{day}</label>
                    <input
                      type="time"
                      {...register(`work_schedule.${index}.startTime`)}
                      disabled={!isDayChecked}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="time"
                      {...register(`work_schedule.${index}.endTime`, {
                        validate: (value) => {
                          const startTime = getValues(`work_schedule.${index}.startTime`);
                          return !startTime || validateEndTime(startTime, value) || 'End time must be after start time';
                        }
                      })}
                      disabled={!isDayChecked}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.work_schedule?.[index]?.endTime && (
                      <p className="text-red-500 text-sm">{errors.work_schedule[index]?.endTime?.message}</p>
                    )}
                  </div>
                );
              })}
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
              >
                Назад
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddWorker;
