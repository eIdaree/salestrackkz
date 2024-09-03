import { useContext, useEffect, useState } from "react";
import { Context } from "../main";

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {store} = useContext(Context)

  console.log(store.user)
  useEffect(() => {
    const fetchUserData = async () => {
      if (store.user) {
        try {
          setFirstName(store.user.first_name);
          setLastName(store.user.last_name);
          setEmail(store.user.email);
          setPhoneNumber(store.user.phone_number);
        } catch (error) {
          console.error("Ошибка при получение данных: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [store.user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className=" text-lg">Данная страница находится в разработке</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center p-6 dark:bg-slate-800">
      <div className="bg-white-100  p-8 rounded-lg shadow-md max-w-lg w-full dark:bg-slate-900 text-white">
        <p className="text-2xl font-semibold  mb-4">ФИО : {firstName} {lastName}</p>
        <p className="text-lg  mb-2">Электронная почта : {email}</p>
        <p className="text-md ">Номер телефона : {phoneNumber}</p>
      </div>
    </div>
  );
};

export default Profile;
