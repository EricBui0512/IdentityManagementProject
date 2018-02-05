import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import DataActivity from "./DataActivity";
class Activity extends Component {
    render() {
        return (
            <div className="main_container">
                <Header/>
                <div className="right-col">
                    <div className="row">
                        <Navigation />
                    </div>
                    <div className="row pd30 content pd10-767">
                        <div className="col-md-12">
                            <div className="row">
                                <h2>Activities</h2>
                                <DataActivity />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Activity;
