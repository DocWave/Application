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


module.exports = React.createClass({
  getInitialState: function() {
    if (navigator.onLine) {
      return {
        online: true,
        connectIcon: <WifiOn/>
      }
    } else { return { online: false, connectIcon: <WifiOff/> }  }
  },
  updateOnlineIcon: function() {
    if (navigator.onLine) {
      this.setState({
        online: true,
        connectIcon: <WifiOn/>
      })
    } else {
      this.setState({
        online: false,
        connectIcon: <WifiOff/>
      })
    }
  },
  render: function () {
    window.addEventListener('online', this.updateOnlineIcon);
    window.addEventListener('offline', this.updateOnlineIcon);
    return (
			<AppBar docked={true} title="DocWave" id="Navigation" style={{'textAlign': 'center'}}
					iconElementLeft={<IconButton onClick={this.props.toggleSideBar}><MenuIcon/></IconButton>}
					iconElementRight={<IconButton onClick={this.props.toggleSideBar}>{this.state.connectIcon}</IconButton>}
					/>
			)
		}
	})
