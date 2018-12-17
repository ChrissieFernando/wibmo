import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  makeSelectLocation,
  makeSelectTransaction,
  makeSelectTransactionDetail,
} from '../selector';
import {
  makeSelectLoginProfile,
  makeSelectGlobals,
} from '../../Login/selectors';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import { globals } from '../../Login/actions';
import TransactionDetail from '../../../components/Transaction/TransactionDetail';
import reducer from '../reducer';
import saga from '../saga';

class Transaction extends PureComponent {
  componentDidMount() {}

  render() {
    const { transaction, profile, history, match, globalData } = this.props;
    return (
      <TransactionDetail
        globals={this.props.globals}
        transaction={transaction}
        profile={profile}
        history={history}
        match={match}
        globalData={globalData}
      />
    );
  }
}

Transaction.propTypes = {
  globals: PropTypes.func.isRequired,
  globalData: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  makeSelectTransactionDetail: makeSelectTransactionDetail(),
  transaction: makeSelectTransaction(),
  location: makeSelectLocation(),
  profile: makeSelectLoginProfile(),
  globalData: makeSelectGlobals(),
});

const withConnect = connect(
  mapStateToProps,
  { globals },
);

const withReducer = injectReducer({ key: 'transaction', reducer });
const withSaga = injectSaga({ key: 'transaction', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Transaction);
