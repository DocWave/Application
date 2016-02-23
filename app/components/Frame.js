import React from 'react';

module.exports = React.createClass({
	render: function() {
		return (
			<div>
			<iframe
					id="doc_frame"
					src={this.props.currentFrame}
					height="90%"
					width="100%"
					style={{'float': 'right'}}
					frameBorder={0}
					seamless="seamless" />
			</div>
		)
	}
})
