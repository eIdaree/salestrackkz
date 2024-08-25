import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosPromise } from 'axios';
import WorkerEditModal from './WorkerEditModal';

type Worker = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  salary: number;
  is_whatsapp_verify: boolean;
  is_telegram_verify: boolean;
  telegram_id: string;
};

const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const userdata = await axios.get<AxiosPromise<Worker>>(`${import.meta.env.VITE_BACK_URL}employee/${id}/`);
        setWorker(userdata.data);
      } catch (error) {
        console.error('Error fetching worker details:', error);
      }
    };

    fetchWorker();
  }, [id]);

  const handleWorkerUpdate = (updatedWorker: Worker) => {
    setWorker(updatedWorker);
  };

  if (!worker) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="bg-white-100 p-6 rounded-lg shadow-lg">
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
