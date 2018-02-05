import React, { Component } from 'react';
class Navigation extends Component{

    render() {
        return (
            <div className="col-xs-12 relative">
                <nav className="nav underline-none w100p flexible h70">
                    <div className="pull-left">
                        <a className="pointer size20 toggleMenu">
                            <i className="fa fa-bars"></i>
                        </a>
                        <span className="size20 color-fff no-effect">
                            <i className="fa fa-bars"></i>
                        </span>
                        <span className="size20 color-fff no-effect">
                            <i className="fa fa-bars"></i>
                        </span>
                    </div>

                    <div className="margin-auto">
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
                        <a className="pointer size20">
                            <i className="fa fa-user"></i>
                        </a>
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
