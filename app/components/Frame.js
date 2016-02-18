import React from 'react';

module.exports = React.createClass({
	getInitialState: function() {
		return {currentView: 'welcome.html'}
	},
	render: function() {
		return (
			<div>
			<iframe
					id="doc_frame"
					src={this.state.currentView}
					height="85%"
					width="100%"
					style={{'float': 'right'}}
					frameBorder={0}
					seamless="seamless" />
			</div>
		)
	}
})
