import React, { Suspense, useContext, useEffect, useState } from 'react';
import WorkerTable from './WorkerTable';
import axios from 'axios';
import { Context } from '../../main';

type Worker = {
  id: string,
  companyID: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  salary: number,
  is_whatsapp_verify:boolean;
  is_telegram_verify:boolean;
  telegram_id:string;
};

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const {store} = useContext(Context);

  const getWorkerList = async () => {
    try {
      const data = await axios.get(`${import.meta.env.VITE_BACK_URL}employee`);
      const userdata = data.data.results
      console.log(userdata)
      if (userdata) {
          const filteredData = userdata;
          setWorkers(filteredData);
        };

      return () => unsubscribe(); 
      
    } catch (err) {
      console.error(err);
    }
  };
// * 
  useEffect(() => {
    const cleanup = getWorkerList();
    return () => {
      if (cleanup) {
        getWorkerList() 
      }
    };
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
