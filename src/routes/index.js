import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../components/Home/';
import Indentity from '../components/Indentity/';
import Contact from '../components/Contact/';
import Activity from '../components/Activity/';
import ConfirmVerify from '../components/Indentity/ConfirmVerify';
import RootContainer from '../containers/RootContainer'

export default () => (
    <RootContainer>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/indentity" component={Indentity} />
            <Route exact path="/contact/:address?/" component={Contact} />
            <Route exact path="/activity" component={Activity} />
            <Route exact path="/facet/:pathParam1?/:pathParam2?" component={ConfirmVerify} />
        </Switch>
    </RootContainer>
)
