import React from 'react';

// Top Navigation
import AppBar from 'material-ui/lib/app-bar';

// Button (for icons)
import IconButton from 'material-ui/lib/icon-button';

// Icons
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import Gear from 'material-ui/lib/svg-icons/action/settings';


module.exports = React.createClass({
  render: function () {
    let that = this
    return (
			<AppBar docked={true} title="DocWave" id="Navigation" style={{'textAlign': 'center', 'color': 'white'}}
          switchFrame={this.props.switchFrame}
					iconElementLeft={
            <IconButton onClick={this.props.toggleSideBar}>
              <MenuIcon/>
            </IconButton>}
          iconElementRight={
              <IconButton onClick={function() {that.props.switchFrame('settings.html')}}><Gear/></IconButton>
            }
					/>
			)
		}
	})
