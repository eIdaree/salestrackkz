import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ISchedule, IWorker } from '../../types/types';



type WorkerEditModalProps = {
  worker: IWorker;
  onClose: () => void;
  onUpdate: (updatedWorker: IWorker) => void;
};

const DAYS_OF_WEEK = [
  { name: 'Понедельник', value: 0 },
  { name: 'Вторник', value: 1 },
  { name: 'Среда', value: 2 },
  { name: 'Четверг', value: 3 },
  { name: 'Пятница', value: 4 },
  { name: 'Суббота', value: 5 },
  { name: 'Воскресенье', value: 6 },
];

const WorkerEditModal: React.FC<WorkerEditModalProps> = ({ worker, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<IWorker>({ ...worker, schedule: worker.schedule || [], });
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [isEditingSchedule, setIsEditingSchedule] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get<ISchedule[]>(`${import.meta.env.VITE_BACK_URL}schedule/?employee_id=${worker.id}`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          schedule: response.data, // Assuming the API returns the schedule as an array
        }));
        setActiveDays(response.data.map((schedule: ISchedule) => schedule.week_day));
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule();
  }, [worker.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSchedule = formData.schedule.map((daySchedule, i) =>
      i === index ? { ...daySchedule, [name]: value } : daySchedule
    );
    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  const toggleDayActive = (day: number) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter((d) => d !== day));
      setFormData((prevData) => ({
        ...prevData,
        schedule: prevData.schedule.filter((schedule) => schedule.week_day !== day),
      }));
    } else {
      setActiveDays([...activeDays, day]);
      setFormData((prevData) => ({
        ...prevData,
        schedule: [...prevData.schedule, { id: 0, week_day: day, time_from: '', time_to: '' }],
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Prepare the data in the required format
      const updateData = {
        profile: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          salary: formData.salary,
        },
        schedule: formData.schedule.map((schedule) => ({
          week_day: schedule.week_day,
          time_from: schedule.time_from,
          time_to: schedule.time_to,
        })),
      };

      // Send the data to the backend
      const response = await axios.put(
        `${import.meta.env.VITE_BACK_URL}schedule/${worker.id}/`,
        updateData
      );

      // Check if the response data is valid and not empty
      if (response.data) {
        // Update the UI with the new worker information
        onUpdate({
          ...worker,
          first_name: response.data.profile.first_name,
          last_name: response.data.profile.last_name,
          email: response.data.profile.email,
          phone_number: response.data.profile.phone_number,
          salary: response.data.profile.salary,
          schedule: response.data.schedule,
        });
        onClose(); // Close the modal
      } else {
        console.error('Empty response received after updating the worker.');
      }
    } catch (error) {
      console.error('Error updating worker details:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {isEditingSchedule ? 'Редактировать расписание' : 'Редактировать профиль'}
        </h3>

        {!isEditingSchedule ? (
          // Worker Data Editing Section
          <div className="mb-6">
            <div className="mb-4">
              <label className="block font-semibold">Имя</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Фамилия</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Электронная почта</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Телефонный номер</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Зарплата</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                Отмена
              </button>
              <button onClick={() => setIsEditingSchedule(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Редактировать расписание
              </button>
            </div>
          </div>
        ) : (
          // Schedule Editing Section
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-2">Рабочие дни</h4>
            {DAYS_OF_WEEK.map((day) => {
              const scheduleIndex = formData.schedule.findIndex((schedule) => schedule.week_day === day.value);
              const schedule = scheduleIndex >= 0 ? formData.schedule[scheduleIndex] : null;

              return (
                <div key={day.value} className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={activeDays.includes(day.value)}
                    onChange={() => toggleDayActive(day.value)}
                    className="mr-2"
                  />
                  <span className="w-24">{day.name}</span>
                  <input
                    type="time"
                    name="time_from"
                    value={schedule?.time_from || ''}
                    onChange={(e) => handleScheduleChange(scheduleIndex, e)}
                    disabled={!activeDays.includes(day.value)}
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="time"
                    name="time_to"
                    value={schedule?.time_to || ''}
                    onChange={(e) => handleScheduleChange(scheduleIndex, e)}
                    disabled={!activeDays.includes(day.value)}
                    className="border rounded p-2 w-full ml-2"
                  />
                </div>
              );
            })}

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingSchedule(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Назад
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Сохранить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerEditModal;
