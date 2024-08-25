import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/authContext.tsx'

import { Provider } from 'react-redux';
import Store from './store/user-store.ts'

interface State {
  store: Store,
}

export const store = new Store();

export const Context = createContext<State>({
  store,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> 
      <Context.Provider value={{store}}>
        <App />
      </Context.Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
