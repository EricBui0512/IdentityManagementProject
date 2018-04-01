import React, { Component } from 'react';
import _ from 'lodash'
const ContactRow = ({contact, handleCheckOwner, active, activeProps}) => {
    return (
         <a className={(active == activeProps ? "activeContact " : "") + "none-effect block"} onClick={(e) => handleCheckOwner(contact, active)}>
            <div className="pd-15 contact-items">
                <h5 className="uppercase color-000 mg-0 bold">{contact.name}</h5>
                <p className="mgt-5 italic color-77808c">{contact.email}</p>
            </div>
        </a>

    )
}
class ContactList extends Component {
    _renderContacts = () => {
        var elements = [];
        var isExists = [];
        _.forEach(this.props.contacts,(contact,index) => {
            if (isExists.indexOf(contact.owner) == -1) {
                elements.push(
                    <ContactRow
                        contact={contact}
                        key={index}
                        handleCheckOwner={this.props.handleCheckOwner}
                        active={index}
                        activeProps={this.props.active}
                        />
                )
                isExists.push(contact.owner);
            }
        })
        return elements
    }
    render() {
        return (
            <div className="panel">
                <div className="panel-heading bg-c7c6c6">
                    <h3 className="mg-0 uppercase"> Contacts </h3>
                </div>
                <div className="panel-body pd-0">
                    {this._renderContacts()}
                </div>
            </div>
        );
    }
}

export default ContactList;
