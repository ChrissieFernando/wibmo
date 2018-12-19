import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  makeSelectLoginProfile,
  makeSelectGlobals,
} from '../../Login/selectors';
import EditGroup from '../../../components/UserAccessManagement/EditGroup';
import Schema from './Schema';

class AssignUserToGroup extends Component {
  componentDidMount() {}

  render() {
    const { ProfileData, GlobalData } = this.props;
    return (
      <EditGroup
        jsonSchema={Schema}
        ProfileData={ProfileData}
        GlobalData={GlobalData}
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
};

export default compose(withConnect)(AssignUserToGroup);
