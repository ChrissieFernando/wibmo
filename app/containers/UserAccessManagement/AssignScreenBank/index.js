import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  makeSelectLoginProfile,
  makeSelectGlobals,
} from '../../Login/selectors';
import AssignScreenBank from '../../../components/UserAccessManagement/AssignScreenBank';
import Schema from './Schema';

class AssignScreenToBank extends Component {
  componentDidMount() {}

  render() {
    const { ProfileData, GlobalData, history, match } = this.props;
    return (
      <AssignScreenBank
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

AssignScreenToBank.propTypes = {
  ProfileData: PropTypes.object.isRequired,
  GlobalData: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(withConnect)(AssignScreenToBank);
