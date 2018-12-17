/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Proptypes from 'prop-types';
import Axios from 'axios';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Notification from 'antd/lib/notification';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/sidenav';
import Footer from '../../components/common/footer';
import { makeSelectRbaConfiguration } from './selectors';
import { makeSelectGlobals, makeSelectLoginProfile } from '../Login/selectors';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import { fetchRbaConfiguration } from './actions';
import reducer from './reducer';
import saga from './saga';
import { RBA_CONFIG } from '../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      lastFetched: '',
      loading: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.Rba &&
      state.lastFetched !== props.Rba.lastFetched &&
      state.initial
    ) {
      Notification.destroy();
      Notification.success({
        message: 'Successfully Updated',
        duration: 3,
      });
      return {
        lastFetched: props.Rba && props.Rba.lastFetched,
      };
    }
    return {};
  }

  change = ref => {
    this.setState({
      text: ref.target.value,
    });
  };

  openNotificationWithIcon = (type, description) => {
    Notification[type]({
      ...description,
      duration: 3,
    });
  };

  IsValidJSONString = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  componentDidMount() {
    const url = RBA_CONFIG(this.props.globals && this.props.globals.bank_id);

    Axios.get(url)
      .then(res => {
        if (res.data['Response-Code'] == '200')
          this.setState({
            text: res.data.RBAScript,
            loading: true,
          });
        else {
          Notification.destroy();
          this.openNotificationWithIcon('error', {
            message: 'RBA Fetch Error',
            description: res.data.Result,
          });
          this.setState({
            loading: true,
          });
        }
      })
      .catch(() => {
        Notification.destroy();
        this.openNotificationWithIcon('error', {
          message: 'Fetch Error',
          description: 'Unable to Fetch data',
        });
        this.setState({
          loading: true,
        });
      });
    this.setState({
      initial: true,
      lastFetched: this.props.Rba && this.props.Rba.lastFetched,
    });
  }

  submit = () => {
    Notification.destroy();
    if (
      this.state.text &&
      this.state.text.length >= 10 &&
      this.props.globals.bank_id
    )
      this.props.fetchRbaConfiguration({
        bankId: this.props.globals.bank_id.toString(),
        productId: '1',
        release: 'P',
        user: this.props.profile.userProfile.user_id,
        configType: 'RBA',
        configClass: 'DEFAULT',
        status: '1',
        rbaScript: this.state.text,
        permissionId_list: this.props.profile.permissionList,
        // permissionId_list: [222, 333]
      });
    else if (!this.props.globals.bank_id)
      this.openNotificationWithIcon('error', {
        message: 'Validation Error',
        description: 'Please Select A Bank',
      });
    else
      this.openNotificationWithIcon('error', {
        message: 'Validation Error',
        description:
          'RBA Configuration should contain minimum of 10 Characters',
      });
  };

  render() {
    return (
      <div className="main">
        <Header history={this.props.history} />
        <div className="main__body">
          <Sidebar history={this.props.history} />
          <div className="main__wrapper">
            <div className="page">
              <div className="page__header level">
                <div className="level-left">
                  <div className="level-item">
                    <h4 className="page__title">RBA Configuration</h4>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Button
                      type="secondary"
                      label="Clear Configuration"
                      fullwidth
                      onClick={() => this.setState({ text: '' })}
                    />
                  </div>
                  <div className="level-item">
                    <Button
                      type="primary"
                      label="Save Configuration"
                      fullwidth
                      onClick={() => this.submit()}
                    />
                  </div>
                </div>
              </div>
              <div className="page__content page__content--height">
                {this.state.loading ? (
                  <div className="field">
                    <div className="control">
                      <textarea
                        className="textarea page__textarea"
                        type="text"
                        value={this.state.text}
                        onChange={this.change}
                        placeholder="[
                    '{{repeat(5, 7)}}',
                    {
                      _id: '{{objectId()}}',
                      index: '{{index()}}',
                      guid: '{{guid()}}',
                      isActive: '{{bool()}}',
                    }
                  ]"
                      />
                    </div>
                  </div>
                ) : (
                  <Loader
                    type="Puff"
                    color="#00BFFF"
                    height="100"
                    width="100"
                  />
                )}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  fetchRbaConfiguration: Proptypes.func,
  Rba: Proptypes.object,
  history: Proptypes.object,
  profile: Proptypes.object,
  globals: Proptypes.object,
};

const mapStateToProps = createStructuredSelector({
  globals: makeSelectGlobals(),
  profile: makeSelectLoginProfile(),
  Rba: makeSelectRbaConfiguration(),
});

const withConnect = connect(
  mapStateToProps,
  { fetchRbaConfiguration },
);

const withReducer = injectReducer({ key: 'rbaConfiguration', reducer });
const withSaga = injectSaga({ key: 'rbaConfiguration', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
