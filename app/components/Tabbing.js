import React from 'react';

// tab components
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

module.exports = React.createClass({
	tabGenerator: function(label, value) {
		return <Tab label={label} onActive={console.log(`tab is ${label}`)} value={value} onClick={ function() {
			return this.props.switchTab(value)
		}.bind(this) } />
	},
  render: function () {
    return (
			<Tabs value={this.props.currentTab} onChange={this.change} switchTab={this.props.switchTab}>
				{this.tabGenerator('Tab A', 'a')}
				{this.tabGenerator('Tab B', 'b')}
				{this.tabGenerator('Tab C', 'c')}
				{this.tabGenerator('Tab D', 'd')}
				{this.tabGenerator('Tab E', 'e')}
				{this.tabGenerator('Tab F', 'f')}
				{this.tabGenerator('Tab G', 'g')}
				{this.tabGenerator('Tab H', 'h')}
			</Tabs>
			)
		}
	})
