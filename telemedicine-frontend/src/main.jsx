import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/Store.js';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import process from 'process';
window.process = process;


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={store}>
         <App />
    </Provider>
    </BrowserRouter>
   
)
