import React, { Component } from 'react';

class Logo extends Component{

    render() {
        return (
            <div className="flexible-start h70 pdf-45">
                <a href="/" className="logo italic underline-none">
                    <span className="color-b4b2c5">Next</span>
                    <span className="color-fff bold">ID</span>
                </a>
                <a className="pointer toggleMenu hidden-md hidden-lg close-menu">
                    <i className="fa fa-times"></i>
                </a>
            </div>
        );
    }
}

export default Logo;
