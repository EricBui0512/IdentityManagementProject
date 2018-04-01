import React, { Component } from 'react';
import FacetActivityTab from './FacetActivityTab';
import {Tabs, Tab} from 'material-ui/Tabs';
import styles from '../../constants/styles'
import FACET from '../../constants/facetActions'

class FacetActivity extends Component {
    constructor(props){
        super(props)
        this.state = {
            initialSelectedIndex: 0
        }
    }
    render() {
        return (
            <div>
                <h3>Activites</h3>

                <div className="container-tabs">
                    <Tabs
                        tabItemContainerStyle={styles.tabItemContainerStyleGrey}
                        contentContainerStyle={styles.contentContainerStyle}
                        initialSelectedIndex={this.state.initialSelectedIndex}
                    >
                        <Tab label="Authorization" >    
                            <div className="pd-20">
                                <FacetActivityTab activity={this.props.facetActivity.authorization} type={FACET.FACET_ACTIVITY_AUTHORIZATION} setType={this.setType} shareFacet={this.props.shareFacet} revokeFacet={this.props.revokeFacet}/>
                            </div>
                        </Tab>
                        <Tab label="Verification">
                            <div className="pd-20">
                                <FacetActivityTab activity={this.props.facetActivity.verification} type={FACET.FACET_ACTIVITY_VERIFICATION} setType={this.setType} />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default FacetActivity;