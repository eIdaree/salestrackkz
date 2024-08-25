import React, { Suspense,  useState } from 'react';
import WorkerTable from './WorkerTable';
import axios from 'axios';
import { IWorker } from '../../types/types';



const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<IWorker[]>([]);

  const getWorkerList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_URL}employee`);
      const userdata = response.data.results;
      if (userdata) {
        setWorkers(userdata);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddWorker = () => {
    getWorkerList(); 
  };

 

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <WorkerTable workers={workers}  onAddWorker={handleAddWorker} />
      </Suspense>
    </div>
  );
};

export default WorkerManagement;
