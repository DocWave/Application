import React from 'react';
import Navigation from './Navigation';

module.exports = React.createClass({
  render: function () {
    return (
        <div id="rightBody" style={{'width': this.props.rightBodyWidth, 'float':'right'}}>
						<Navigation toggleSideBar={this.props.toggleSideBar} switchFrame={this.props.switchFrame}/>
              <webview
        					id="doc_frame"
        					src={this.props.currentFrame}
        					autosize="on">
              </webview>
				</div>
			)
		}
	})
