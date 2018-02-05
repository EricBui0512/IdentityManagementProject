import React, { Component } from 'react';
import Navigation from './components/Navigation';
import SideBar from './components/SideBar';
import CreateProject from  './components/home/CreateProject';

class App extends Component {
  render() {
    return (
        <div className="main_container">
            <div className="col-md-3 left_col menu_fixed">
                <div className="left_col scroll-view">
                    <div className="navbar nav_title">
                        <a href={this.props.url} className="site_title"></a>
                    </div>
                    <div className="clearfix"></div>
                    <SideBar/>
                </div>
            </div>
            <Navigation/>
            <CreateProject/>
        </div>
    );
  }
}

export default App;
