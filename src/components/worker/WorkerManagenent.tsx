import React, { Suspense, useContext, useEffect, useState } from 'react';
import WorkerTable from './WorkerTable';
import axios from 'axios';
import { Context } from '../../main';
import { IWorker } from '../../types/types';



const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const { store } = useContext(Context);

  const getWorkerList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_URL}employee`);
      const userdata = response.data.results;
      console.log(userdata);
      if (userdata) {
        setWorkers(userdata);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWorkerList();
  }, [store.user]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <WorkerTable workers={workers} />
      </Suspense>
    </div>
  );
};

export default WorkerManagement;
