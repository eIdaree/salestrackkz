import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddWorker from './addWorker';
import { IWorker } from '../../types/types';
import axios from 'axios';

type WorkerTableProps = {
  workers: IWorker[];
  onAddWorker: () => void;
  onDeleteWorker: () => void;
};

const WorkerTable: React.FC<WorkerTableProps> = ({ workers, onAddWorker, onDeleteWorker }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWorkerPage, setIsWorkerPage] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  useEffect(() => {
    if (location.pathname === '/workers') {
      setIsWorkerPage(true);
    } else {
      setIsWorkerPage(false);
    }
  }, [location.pathname]);

  const handleDelete = async (worker: IWorker) => {
    await axios.delete<IWorker>(`https://sailau.xyz/api/employee/${worker.id}`);
    onDeleteWorker();
  };

  const handleRowClick = (workerID: string) => {
    navigate(`/workers/${workerID}`);
  };

  return (
    <div className='9vh'>
      <nav className="flex justify-between items-center mb-8 max-xl:mt-16">
        <h2 className="text-lg font-semibold">Работники</h2>
        {isWorkerPage && (
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="hover:bg-blue-600 hover:text-white px-4 py-2 bg-blue-500 rounded-xl text-white"
          >
            Добавить сотрудника
          </button>
        )}
      </nav>

      {showAddWorkerModal && (
        <AddWorker
          onClose={() => {
            setShowAddWorkerModal(false);
            onAddWorker();
          }}
        />
      )}

      <div className={`${isWorkerPage? '' : 'overflow-y-auto'} h-48`}>
        <table className={`min-w-full ${isWorkerPage ? 'block' : 'hidden'} md:table dark:text-white`}>
          <thead>
            <tr >
              <th  className='dark:bg-slate-800 border-2 border-white'>Имя</th>
              <th  className='dark:bg-slate-800 border-2 border-white'>Почта</th>
              <th  className='dark:bg-slate-800 border-2 border-white'>Номер телефона</th>
              <th  className='dark:bg-slate-800 border-2 border-white'>Зарплата</th>
              {isWorkerPage && <th  className='dark:bg-slate-800 border-2 border-white'>Действие</th>}
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr
                key={worker.id}
                onClick={() => handleRowClick(worker.id)}
                className="cursor-pointer dark:hover:bg-slate-600 hover:bg-gray-100 "
              >
                <td className='border-2 dark:border-white'>{worker.first_name} {worker.last_name}</td>
                <td className='border-2 dark:border-white'>{worker.email}</td>
                <td className='border-2 dark:border-white'>{worker.phone_number}</td>
                <td className='border-2 dark:border-white'>{worker.salary}</td>
                {isWorkerPage && (
                  <td className='border-2 dark:border-white'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(worker);
                      }}
                      className="bg-blue-500 py-1 px-4 ml-4 rounded-xl hover:bg-red-600 text-white"
                    >
                      X
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile-friendly layout */}
        <div className={`md:hidden space-y-4`}>
          {workers.map((worker) => (
            <div
              key={worker.id}
              onClick={() => handleRowClick(worker.id)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4 ">
                <div className="text-lg font-semibold">
                  {worker.first_name} {worker.last_name}
                </div>
                {isWorkerPage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(worker);
                    }}
                    className="bg-blue-500 py-1 px-4 ml-4 rounded-xl hover:bg-red-600 text-white"
                  >
                    X
                  </button>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Почта:</span> {worker.email}
                </div>
                <div>
                  <span className="font-semibold">Номер телефона:</span> {worker.phone_number}
                </div>
                <div>
                  <span className="font-semibold">Зарплата:</span> {worker.salary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerTable;
