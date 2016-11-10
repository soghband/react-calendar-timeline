import React, { Component } from 'react'

export default class InfoLabel extends Component {
  render () {
    return (
      <div className='rct-infolabel'>
        {this.props.label}
      </div>
    )
  }
}

InfoLabel.propTypes = {
  label: React.PropTypes.string.isRequired
}
InfoLabel.defaultProps = {
  label: ''
}
