import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from '../src/routes/home-page/home';
import FinishSession from "./routes/finish-session-page/finish-session";
import AboutUs from "./routes/aboutus/aboutus";
import FieldDayFormSelectionForm from "./routes/FieldDayFormSelectionForm/FieldDayFormSelectionForm";
import SyncData from "./routes/sync-data-page/sync-data-page";
import UnSyncHistory from './routes/un-sync-history/un-sync-history';
import TemplatePage from "./components/template-page/template-page";

import './App.css';

const App = () => {
    return (
        <div className="App">
            <Switch>
                <Route path="/" component={Home} exact/>
                <Route path="/AboutUs" component={AboutUs}/>
                <Route path="/finish-session" component={FinishSession}/>
                <Route path="/sync-data" component={SyncData}/>
                <Route path="/new-data" component={UnSyncHistory}/>
                <Route path="/FieldDayFormSelectionForm" component={FieldDayFormSelectionForm}/>
                <Route path="/:form_name_n" component={TemplatePage} exact/>
            </Switch>
        </div>
    );
}

export default App;
