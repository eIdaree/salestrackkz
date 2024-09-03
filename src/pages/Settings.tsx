import { useTheme } from "../redux/context/ThemeContext";

type Props = {}

function Settings({}: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-1/2 m-16 bg-white dark:bg-slate-800 dark:text-white p-8 rounded dark:border-2 dark:border-white">
      <h1>Настройки</h1>
      <br></br>
      <span>Сменить тему</span>
      <button
        onClick={toggleTheme}
        className="p-2 ml-8 border rounded"
        >
         {theme === 'light' ? 'Темную' : 'Светлую'} 
      </button>
 
    </div>
  )
}

export default Settings