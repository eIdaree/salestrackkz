import React, { useEffect, useState } from 'react';
import WorkerTable from './WorkerTable';
import axios from 'axios';
import { IWorker } from '../../types/types';
import Spinner from '../../util/Spinner';

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  

  const getWorkerList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_URL}employee`);
      const userdata = response.data.results;
      if (userdata) {
        setWorkers(userdata);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);  
    }
  };

  const handleAddWorker = () => {
    getWorkerList(); 
  };

  const handleDeleteWorker = () => {
    getWorkerList();
  };

  useEffect(() => {
    getWorkerList();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner/>
      ) : (
        <WorkerTable workers={workers} onAddWorker={handleAddWorker} onDeleteWorker={handleDeleteWorker} />
      )}
    </div>
  );
};

export default WorkerManagement;
