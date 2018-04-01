import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import _ from "lodash";

class Navigation extends Component{
    handleLogout = () => {
        if (_.isFunction(this.props.handleLogout)) {
            this.props.handleLogout();
        }
    }

    handleLogin = () => {
        if (_.isFunction(this.props.handleLogin)) {
            this.props.handleLogin();
        }
    }

    renderLogged() {
        if (!_.isEmpty(this.props.accounts) || !_.isEmpty(this.props.userProfile.data)) {
            return (
                <IconMenu
                    iconButtonElement={
                        <a className="pointer size20 welcome-user-block">
                            <div className="div-welCome">
                            <p className="p-userName">
                                {this.props.userProfile.data.userName}
                            </p>
                            <i className="fa fa-caret-down" />
                            </div>
                        </a>
                    }
                    >
                    <MenuItem primaryText="Log out" onClick={this.handleLogout}/>
                </IconMenu>
            );
        }

        return (
            <IconMenu
                iconButtonElement={
                    <a className="pointer size20">
                        <i className="fa fa-user" />
                    </a>
                }
                >
                <MenuItem primaryText="Log in" onClick={this.handleLogin}/>
            </IconMenu>
        )
    }

    render() {
        return (
            <div className="col-xs-12 relative bgw">
                <nav className="nav underline-none w100p flexible h70">
                    <div className="pull-left">
                        <a className="pointer size20 toggleMenu">
                            <i className="fa fa-bars"></i>
                        </a>
                    </div>

                    <div className="margin-auto">
                        <span className="size20 color-fff no-effect margin-auto">
                            <i className="fa fa-bars"></i>
                        </span>
                    </div>
                    <div className="margin-auto" style={{position:'absolute'}}>
                        <a className="italic text-center logo2 underline-none pointer">
                            <span className="color-a7a9a9">Next</span>
                            <span className="color-50468e bold">ID</span>
                        </a>
                    </div>

                    <div className="pull-right">
                        <a className="pointer size20 openSearch">
                            <i className="fa fa-search"></i>
                        </a>
                        <a className="pointer size20">
                            <i className="fa fa-bell"></i>
                        </a>
                        {
                            this.renderLogged()
                        }
                    </div>
                </nav>
                <div className="row custom-search invisible">
                    <form action="#">
                        <input placeholder="Search key..." className="inputSearch" />
                    </form>
                    <a className="close-search"><i className="fa fa-times"></i></a>
                </div>

            </div>
        );
    }
}

export default Navigation;
