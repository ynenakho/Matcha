import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as historyActions from '../../actions/historyActions';

class History extends Component {
  componentDidMount() {
    const { getVisitors, getVisited } = this.props;
    getVisitors();
    getVisited();
  }

  render() {
    return (
      <div>
        <h1>HISTORY!!!!</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visitors: state.history.visitors,
  visited: state.history.visited
});

export default connect(
  mapStateToProps,
  historyActions
)(History);
