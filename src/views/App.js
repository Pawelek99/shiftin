import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScheduleView from './ScheduleView/ScheduleView';
import InputView from './InputView/InputView';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={InputView} />
        <Route exact path='/view' component={ScheduleView} />
      </Switch>
    </Router>
  );
}

export default App;
