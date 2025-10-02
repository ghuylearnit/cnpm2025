import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

// ✅ dùng react-toastify thay vì react-alert
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    {/* App của bạn */}
    <App />
    {/* Container hiển thị toast (thay AlertProvider cũ) */}
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      theme="light"
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </Provider>
);
