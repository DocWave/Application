import React from 'react';

// child components
import Frame from './Frame' //iframe
import Navigation from './Navigation'
import Tabbing from './Tabbing'


module.exports = React.createClass({
  render: function () {
    return (
        <div id="rightBody" style={{'width': this.props.rightBodyWidth, 'float':'right'}}>
						<Navigation toggleSideBar={this.props.toggleSideBar}/>
						<Tabbing currentTab={this.props.currentTab} switchTab={this.props.switchTab}/>
		        <Frame/>
				</div>
			)
		}
	})
