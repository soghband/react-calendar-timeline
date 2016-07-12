/**
 * Created by xmityaz on 10.07.16.
 */

import React, { PropTypes, Component } from 'react';

class FogOfWar extends Component {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.height === this.props.height &&
      nextProps.headerHeight === this.props.headerHeight &&
      nextProps.fogTimeFrom === this.props.fogTimeFrom &&
      nextProps.fogTimeTo === this.props.fogTimeTo
    );
  }

  render() {
    const { canvasTimeStart, canvasTimeEnd, canvasWidth, height, headerHeight, fogTimeFrom, fogTimeTo } = this.props;
    const ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart);
    const fogTimeFromLeft = Math.round((fogTimeFrom - canvasTimeStart) * ratio, -2);
    const fogTimeToRight = Math.round((canvasTimeEnd - fogTimeTo) * ratio, -2);
    const style = {
      top: `${headerHeight}px`,
      height: `${height - headerHeight}px`
    };

    const fogFromStyle = {
      ...style,
      left: `${fogTimeFromLeft}px`,
      right: 0
    };
    const fogToStyle = {
      ...style,
      right: `${fogTimeToRight}px`,
      left: 0
    };

    return (
      <div>
        <div className="rtc-fog" style={fogToStyle}></div>
        <div className="rtc-fog" style={fogFromStyle}></div>
      </div>
    );
  }
}

FogOfWar.propTypes = {
  canvasTimeStart: PropTypes.number.isRequired,
  canvasTimeEnd: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.number.isRequired,
  fogTimeFrom: PropTypes.number,
  fogTimeTo: PropTypes.number
};

export default FogOfWar;
