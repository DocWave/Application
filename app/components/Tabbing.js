import React from 'react';

// tab components
import Tabs from 'material-ui/lib/tabs/tabs';

module.exports = React.createClass({
	tabGenerator: function(label, value) {
		return <Tab label={label} onActive={console.log(`tab is ${label}`)} value={value} onClick={ function() {
			return this.props.switchTab(value)
		}.bind(this) } />
	},
  render: function () {
    return (
			<Tabs children={this.props.currentTabs} value={this.props.currentTab} onChange={this.change} switchTab={this.props.switchTab}>
			</Tabs>
			)
		}
	})
