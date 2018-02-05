import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import CsvData from "./CsvData";
import ContactList from "./ContactList";
import PrimaryData from "./PrimaryData";
class Contact extends Component {
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
                                <div className="col-md-4">
                                    <ContactList />
                                </div>
                                <div className="col-md-8">
                                    <PrimaryData />
                                    <CsvData />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Contact;
