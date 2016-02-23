import React from 'react';

// Top Navigation
import AppBar from 'material-ui/lib/app-bar';

// Button (for icons)
import IconButton from 'material-ui/lib/icon-button';

// Icons
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import MoreHoriz from 'material-ui/lib/svg-icons/navigation/more-horiz';
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import CacheIcon from 'material-ui/lib/svg-icons/action/cached';
import ReaderIcon from 'material-ui/lib/svg-icons/action/chrome-reader-mode';
import WifiOff from 'material-ui/lib/svg-icons/device/signal-wifi-off';
import WifiOn from 'material-ui/lib/svg-icons/notification/wifi';
import Gear from 'material-ui/lib/svg-icons/action/settings';


module.exports = React.createClass({
  render: function () {
    return (
			<AppBar docked={true} title="DocWave" id="Navigation" style={{'textAlign': 'center', 'color': 'white'}}
					iconElementLeft={
            <IconButton onClick={this.props.toggleSideBar}>
              <MenuIcon/>
            </IconButton>}
          iconElementRight={
              <IconButton onClick={this.props.toggleSideBar}><Gear/></IconButton>
            }
					/>
			)
		}
	})
