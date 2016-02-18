import React from 'react';


// Top Navigation
import AppBar from 'material-ui/lib/app-bar';

// Button (for icons)
import IconButton from 'material-ui/lib/icon-button';

// Icons
import MoreHoriz from 'material-ui/lib/svg-icons/navigation/more-horiz';
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import CacheIcon from 'material-ui/lib/svg-icons/action/cached';


module.exports = React.createClass({
  render: function () {
    return (
			<AppBar docked={true} title="DocWave" id="Navigation" style={{'textAlign': 'center'}}
					iconElementLeft={<IconButton onClick={this.props.toggleSideBar}><MoreHoriz/></IconButton>}
					iconElementRight={<IconButton onClick={this.props.toggleSideBar}><CacheIcon /></IconButton>}
					/>
			)
		}
	})
