import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  makeSelectLoginProfile,
  makeSelectGlobals,
} from '../../Login/selectors';
import CreateGroup from '../../../components/UserAccessManagement/CreateGroup';
import Schema from './Schema';

class AssignUserToGroup extends Component {
  componentDidMount() {}

  render() {
    const { ProfileData, GlobalData, history, match } = this.props;
    return (
      <CreateGroup
        jsonSchema={Schema}
        ProfileData={ProfileData}
        GlobalData={GlobalData}
        history={history}
        match={match}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  ProfileData: makeSelectLoginProfile(),
  GlobalData: makeSelectGlobals(),
});

const withConnect = connect(mapStateToProps);

AssignUserToGroup.propTypes = {
  ProfileData: PropTypes.object.isRequired,
  GlobalData: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(withConnect)(AssignUserToGroup);
