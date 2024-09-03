import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import WorkerEditModal from './WorkerEditModal';
import { IWorker } from '../../types/types';





const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [worker, setWorker] = useState<IWorker | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const response: AxiosResponse<IWorker> = await axios.get(`${import.meta.env.VITE_BACK_URL}employee/${id}/`);
        setWorker(response.data);
      } catch (error) {
        console.error('Error fetching worker details:', error);
      }
    };

    fetchWorker();
  }, [id]);

  const handleWorkerUpdate = (updatedWorker: IWorker) => {
    setWorker(updatedWorker);
  };

  if (!worker) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-slate-800 dark:text-white">
        <div className='flex gap-4 items-center'>
          <h2 className="text-2xl font-bold mb-4">{worker.first_name} {worker.last_name}</h2>
          <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Редактировать профиль
          </button>
        </div>
        <p className="mb-2">
          <span className="font-semibold">Электронная почта:</span> {worker.email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Номер телефона:</span> {worker.phone_number}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Зарплата:</span> {worker.salary}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Телеграм:</span> {worker.is_telegram_verify ? '✔️' : '❌'}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Ватсап:</span> {worker.is_whatsapp_verify ? '✔️' : '❌'}
        </p>
      </div>

      {isEditModalOpen && (
        <WorkerEditModal 
          worker={worker} 
          onClose={() => setIsEditModalOpen(false)} 
          onUpdate={handleWorkerUpdate} 
        />
      )}
    </div>
  );
};

export default WorkerDetailPage;
