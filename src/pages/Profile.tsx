import { useContext, useEffect, useState } from "react";
import { Context } from "../main";

const Profile: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {store} = useContext(Context)

  useEffect(() => {
    const fetchUserData = async () => {
      if (store.user) {
        try {
          setName(store.user.first_name);
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
        <div className="text-blue-60 text-lg">Загружается...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white-100 p-8 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold text-blue-60 mb-4">Компания : {name}</h1>
        <h2 className="text-lg text-blue-40 mb-2">Электронная почта : {email}</h2>
        <h2 className="text-md text-blue-40">Номер телефона : {phoneNumber}</h2>
      </div>
    </div>
  );
};

export default Profile;
