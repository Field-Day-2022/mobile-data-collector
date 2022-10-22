import React from 'react'; // react library import
import { Switch, Route } from 'react-router-dom'; // for navigation
import Home from '../src/routes/home-page/home'; // home page import
import FinishSession from './routes/finish-session-page/finish-session'; // finish session page import
import AboutUs from './routes/aboutus/aboutus'; // about us page import
import FieldDayFormSelectionForm from './routes/FieldDayFormSelectionForm/FieldDayFormSelectionForm';
import SyncData from './routes/sync-data-page/sync-data-page';
import UnSyncHistory from './routes/un-sync-history/un-sync-history';
import TemplatePage from './components/template-page/template-page'; // dynamic page route

import './App.css'; // styling

const App = () => {
    return (
        <div className="App">
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/AboutUs" component={AboutUs} />
                <Route path="/finish-session" component={FinishSession} />
                <Route path="/sync-data" component={SyncData} />
                <Route path="/new-data" component={UnSyncHistory} />
                <Route path="/FieldDayFormSelectionForm" component={FieldDayFormSelectionForm} />
                <Route path="/:form_name_n" component={TemplatePage} exact />
            </Switch>
        </div>
    );
};

export default App;
