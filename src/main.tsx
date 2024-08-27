import React, { createContext } from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Store from './store/user-store.ts';

interface State {
  store: Store;
}

export const store = new Store();

export const Context = createContext<State>({
  store,
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOMClient.createRoot(rootElement);

// Render your application using the existing root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Context.Provider value={{ store }}>
        <App />
      </Context.Provider>
    </BrowserRouter>
  </React.StrictMode>
);
