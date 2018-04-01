import React, { Component } from 'react';
import { connect } from 'react-redux'
import MainElement from './routes/index'

class App extends Component {
    // componentWillMount() {
    //     if (this.props.ethereumNode){
    //         this.props.ethereumNode.watch()
    //         console.log("123")
    //     }        
    // }
    componentWillReceiveProps(props){
        if (this.props.ethereumNode){
            this.props.ethereumNode.watch()
        }  
    }
    render() {
        return (
            <MainElement/>
        );
    }
}

const mapStateToProps = state => ({
    ethereumNode: state.connection.ethereum,
    currentBlock: state.global.currentBlock,
    connected: state.global.connected,
});

export default connect(mapStateToProps)(App);

