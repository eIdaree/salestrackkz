import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type WorkerFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  salary: number;
};

type WorkDay = {
  day: string; // Keep this as a string for form handling
  startTime: string;
  endTime: string;
};

type WorkScheduleData = {
  work_schedule: WorkDay[];
};

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const AddWorker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1); // Step 1: Worker details, Step 2: Work schedule
  const [workerId, setWorkerId] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<WorkerFormData & WorkScheduleData>();

  const watchedSchedule = watch("work_schedule");

  // Function to handle the worker form submission
  const handleWorkerSubmit: SubmitHandler<WorkerFormData> = async (data) => {
    try {
      const response = await axios.post('https://sailau.xyz/api/employee/', data);
      setWorkerId(response.data.id); // Assume the API returns the worker ID in response
      setStep(2); // Move to the next step
    } catch (error) {
      console.error('Error submitting worker data:', error);
    }
  };

  const handleScheduleSubmit: SubmitHandler<WorkScheduleData> = async (data) => {
    if (workerId) {
      const mappedSchedule = data.work_schedule.map(day => ({
        week_day: daysOfWeek.indexOf(day.day),
        time_from: day.startTime,
        time_to: day.endTime
      })).filter(day => day.week_day !== -1);

      console.log(mappedSchedule);
      try {
        for (const schedule of mappedSchedule) {
          const url = `https://sailau.xyz/api/schedule/?employee_id=${workerId}`;
          await axios.post(url, schedule);
        }
  
        onClose(); 
      } catch (error) {
        console.error('Error submitting schedule data:', error);
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
          <form onSubmit={handleSubmit(handleWorkerSubmit)} className="space-y-4">
            {/* Worker Details Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя</label>
              <input
                type="text"
                {...register('first_name', { required: 'Имя обязательно' })}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фамилия</label>
              <input
                type="text"
                {...register('last_name', { required: 'Фамилия обязательна' })}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Электронная почта</label>
              <input
                type="email"
                {...register('email', { required: 'Электронная почта обязательна' })}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
              <input
                type="tel"
                {...register('phone_number', { required: 'Номер телефона обязателен' })}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Зарплата</label>
              <input
                type="number"
                {...register('salary', { required: 'Зарплата обязательна' })}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
            </div>
            <button
              type="submit"
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
        {step === 2 && workerId && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Рабочие дни</h2>
            <form onSubmit={handleSubmit(handleScheduleSubmit)} className="space-y-4">
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
                    {errors.work_schedule && errors.work_schedule[index]?.endTime && (
                      <p className="text-red-500 text-xs mt-1">{errors.work_schedule[index]?.endTime.message}</p>
                    )}
                  </div>
                );
              })}
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
              >
                Назад
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
      </div>
    </div>
  );
};

export default AddWorker;
