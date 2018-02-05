import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../components/Home/';
import Indentity from '../components/Indentity/';
import Contact from '../components/Contact/';
import Activity from '../components/Activity/';

export default () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/indentity" component={Indentity} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/activity" component={Activity} />
    </Switch>
)
