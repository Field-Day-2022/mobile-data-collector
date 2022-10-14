import React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react'
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App';
import {rootReducer} from './redux/reducers/root-reducer';
import * as serviceWorker from './serviceWorker';
import './index.css';

const persistConfig = {
    key: 'root',
    storage,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)));
const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
        </Router>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();
