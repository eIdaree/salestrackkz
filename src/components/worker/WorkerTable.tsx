import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { inviteFetch } from '../../util/constants';
import AddWorker from './addWorker';

type Worker = {
  id: string;
  companyID: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  salary: number;
  is_whatsapp_verify: boolean;
  is_telegram_verify: boolean;
  telegram_id: string;
};

type WorkerTableProps = {
  workers: Worker[];
};

// const checkWhatsAppRegistration = async (phoneNumber: string) => {
//   try {
//     const response = await fetch('http://localhost:5000/api/check-whatsapp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ phone_number: phoneNumber }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       return data.isRegistered;
//     } else {
//       console.error('Error checking WhatsApp registration:', data.message);
//       return false;
//     }
//   } catch (error) {
//     console.error('Network error checking WhatsApp registration:', error);
//     return false;
//   }
// };

// const handleWhatsAppCheck = async (worker: Worker) => {
//   const isRegistered = await checkWhatsAppRegistration(worker.phone_number);
//   return isRegistered;
// };

const WorkerTable: React.FC<WorkerTableProps> = ({ workers }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWorkerPage, setIsWorkerPage] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [updatedWorkers, setUpdatedWorkers] = useState<Worker[]>(workers);

  useEffect(() => {
    if (location.pathname === '/workers') {
      setIsWorkerPage(true);
    } else {
      setIsWorkerPage(false);
    }
  }, [location.pathname]);

          
    useEffect (()=>{
      setUpdatedWorkers(workers);
    },[workers])


  const handleInvite = async (worker: Worker) => {
    const data = {
      phone_number: worker.phone_number,
      first_name: worker.first_name,
      last_name: worker.last_name,
    };

    inviteFetch({ data, method: 'POST' });
  };

  const handleRowClick = (workerID: string) => {
    navigate(`/workers/${workerID}`);
  };

  return (
    <div>
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

      {showAddWorkerModal && <AddWorker onClose={() => setShowAddWorkerModal(false)} />}

      <div className="overflow-y-hidden">
        <table className="min-w-full hidden md:table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Почта</th>
              <th>Номер телефона</th>
              <th>Зарплата</th>
              <th>Telegram</th>
              <th>WhatsApp</th>
              {isWorkerPage && <th>Действие</th>}
            </tr>
          </thead>
          <tbody>
            {updatedWorkers.map((worker) => (
              <tr
                key={worker.id}
                onClick={() => handleRowClick(worker.id)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td>
                  {worker.first_name} {worker.last_name}
                </td>
                <td>{worker.email}</td>
                <td>{worker.phone_number}</td>
                <td>{worker.salary}</td>
                <td>{worker.is_telegram_verify ? '✔️' : '❌'}</td>
                <td>{worker.is_whatsapp_verify ? '✔️' : '❌'}</td>
                {isWorkerPage && (
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvite(worker);
                      }}
                      className="bg-blue-500 py-1 px-2 rounded-xl hover:bg-blue-600 text-white"
                    >
                      Пригласить
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile-friendly layout */}
        <div className="md:hidden space-y-4">
          {updatedWorkers.map((worker) => (
            <div
              key={worker.id}
              onClick={() => handleRowClick(worker.id)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">
                  {worker.first_name} {worker.last_name}
                </div>
                {isWorkerPage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvite(worker);
                    }}
                    className="bg-blue-500 py-1 px-2 rounded-xl hover:bg-blue-600 text-white"
                  >
                    Пригласить
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
                <div>
                  <span className="font-semibold">Telegram:</span> {worker.is_telegram_verify ? '✔️' : '❌'}
                </div>
                <div>
                  <span className="font-semibold">WhatsApp:</span> {worker.is_whatsapp_verify ? '✔️' : '❌'}
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
