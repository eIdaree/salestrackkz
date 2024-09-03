import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.svg';
import home from '../assets/icons/Home.svg';
import workers from '../assets/icons/3 User.svg';
import setting from '../assets/icons/Setting.svg';
import profile from '../assets/icons/Profile.svg';
import logout from '../assets/icons/Logout.svg';
import burger from '../assets/icons/Burger.svg'; 

import dark_home from '../assets/dark-icons/Home.svg';
import dark_workers from '../assets/dark-icons/People.svg';
import dark_setting from '../assets/dark-icons/Setting.svg';
import dark_profile from '../assets/dark-icons/Profile.svg';
import dark_logout from '../assets/dark-icons/Logout.svg';

import { useTheme } from "../redux/context/ThemeContext";

type SidebarProps = {
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {theme} = useTheme()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={toggleSidebar}
        className="xl:hidden p-4 fixed top-4 right-4 z-50"
      >
        <img src={burger} alt="Menu" />
      </button>

      <div
        className={`w-64 bg-white dark:bg-slate-900 text-gray-800 dark:text-white flex flex-col fixed top-0 left-0 h-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } xl:transform-none xl:relative transition-transform duration-300 ease-in-out  z-40`}
      >
        <div className="p-4 flex items-center">
          <Link to='/'>
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <Link to='/' className="mb-4 flex gap-4 py-4">
            <img src={theme === 'light' ? home : dark_home} alt="Главная страница" />Главная страница
          </Link>
          <Link to='/workers' className="mb-4 flex gap-4 py-4">
            <img src={theme === 'light' ? workers : dark_workers} alt="Сотрудники" />Сотрудники
          </Link>
          <Link to='/settings' className="mb-4 flex gap-4 py-4">
            <img src={theme === 'light' ? setting : dark_setting } alt="Настройки" />Настройки
          </Link>
          <Link to='/profile' className="mb-4 flex gap-4 py-4">
            <img src={theme === 'light' ? profile : dark_profile} alt="Профиль" />Профиль
          </Link>
          <button onClick={onLogout} className="flex gap-4 py-4">
            <img src={theme === 'light' ? logout : dark_logout} alt="Выйти" />Выйти
          </button>
        </nav>
        <div className="p-4">
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded">Написать в поддержку</button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 xl:hidden z-30"
        ></div>
      )}
    </div>
  );
}

export default Sidebar;
