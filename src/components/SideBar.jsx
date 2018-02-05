import React, { Component } from 'react';
import NavLink from "../components/NavLink";

class SideBar extends Component{
    render() {
        return (
            <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                <div className="menu_section">
                    <ul className="nav side-menu">
                        <NavLink to="/"><i className="fa fa-home mgr-5"></i> HOME </NavLink>
                        <NavLink to="/indentity"><i className="fa fa-address-card mgr-5"></i> IDENTITY </NavLink>
                        <NavLink to="/contact"><i className="fa fa-address-book mgr-5"></i> CONTACT </NavLink>
                        <NavLink to="/activity"><i className="fa fa-universal-access mgr-5"></i> ACTIVITY </NavLink>
                    </ul>
                </div>
            </div>
        );
    }
}

export default SideBar;
