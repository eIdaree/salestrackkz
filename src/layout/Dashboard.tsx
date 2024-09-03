import WorkerManagement from "../components/worker/WorkerManagenent"

const basediv = "bg-white dark:bg-gray-800  w-[100%] p-4 rounded shadow"

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 min-lg:px-16 min-lg:py-8  w-full max-lg:mt-12 dark:bg-slate-800 dark:text-white">
      <div className={`${basediv} max-lg:hidden`}>
        <WorkerManagement />
      </div>
      <div className="gap-4 flex max-lg:flex-col w-full">
        <div className={basediv}>Достижения</div>
        <div className={basediv}>Выплаты</div>
        <div className={basediv}>Штраф</div>
      </div>
      <div className={basediv}>
        <div>Не выполненные KPI</div>
      </div>
    </div>
  );
};

export default Dashboard;
