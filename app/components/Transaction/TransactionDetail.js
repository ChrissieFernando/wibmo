/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable indent */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary 0 */
/* eslint-disable jsx-a11y/click-events-have-key-events 0 */
/* eslint-disable jsx-a11y/no-static-element-interactions 0 */
/* eslint-disable jsx-a11y/anchor-is-valid 0 */
// /* eslint-disable */
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import Icon from '@mdi/react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {
  mdiMinusCircleOutline,
  mdiArrowLeft,
  mdiPlusCircleOutline,
} from '@mdi/js';
import Axios from 'axios';
import Notification from 'antd/lib/notification';
import Button from '../common/Button';
// import Header from '../common/Header';
// import Sidebar from '../common/sidenav';
import {
  BANK_LIST_API,
  AREQ_API,
  CREQ_API,
  RREQ_API,
} from '../../utils/requestUrl';
import Footer from '../common/footer';

const openNotificationWithIcon = (type, description) => {
  Notification[type]({
    ...description,
    duration: 3,
  });
};
class TransactionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TransactionJson: {},
      cardUnion: {
        R: 'RuPay',
        M: 'Master',
        V: 'VISA',
        D: 'DINER',
        A: 'AMEX',
      },
      fetchReport: true,
      params: {},
      transaction_type: ['', 'E-commerce', 'IVR', 'ITP'],
      // authentication_type: [
      //   '',
      //   'FRICTIONLESS',
      //   'OTP',
      //   'STATIC PASSWORD',
      //   'SINGLE SELECT',
      //   'MULTIPLE SELECT',
      // ],
      bank_list: null,
    };
  }

  componentDidMount() {
    // const rreq = transactionJson.filter(o => {
    //   return o.rreq;
    // });
    // const rres = transactionJson.filter(o => o.rres);
    // this.setState({
    //   params: QuaryDecoder(this.props.location.search),
    //   rreq,
    //   rres,
    // });
    Axios.get(BANK_LIST_API).then(res => {
      this.setState({
        bank_list: _.groupBy(res.data.Result, data => data.bank_id),
      });
    });
  }

  static getDerivedStateFromProps(props) {
    if (props.transaction)
      return {
        transactionGroup: _.groupBy(
          props.transaction.transaction,
          o => o.acs_txn_id,
        ),
      };
    return {};
  }

  rreq = type => {
    this.setState({
      TransactionJson: {},
    });
    let url = '';
    if (type === 'areq') url = AREQ_API;

    if (type === 'creq') url = CREQ_API;

    if (type === 'rreq') url = RREQ_API;
    this.setState({
      type,
    });
    Axios.post(
      url,
      {
        fromDate: this.props.globalData.date.from,
        toDate: this.props.globalData.date.to,
        acs_txn_id: this.state.transactionGroup[this.state.params.id][0]
          .acs_txn_id,
        token_id: this.props.profile.userProfile.token_id,
        acct_number: '',
        issuer_id: this.state.transactionGroup[this.state.params.id][0]
          .issuer_id,
        acs_version: '',
        txn_status: '',
        card_type: '',
        card_union: '',
      },
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    ).then(res => {
      if (res.data['Response-Code'] == '200') {
        Notification.destroy();
        openNotificationWithIcon('success', {
          message: 'Successfully Fetched',
          // description: ""
        });
        this.setState({
          TransactionJson: res.data.Result,
        });
      } else {
        Notification.destroy();
        openNotificationWithIcon('error', {
          message: 'Fetch Failed',
          description: res.data.Result,
        });
      }
    });
  };

  render() {
    return (
      <div className="main">
        {/** <Header history={this.props.history} /> */}

        <div className="main__body">
          {/** <Sidebar history={this.props.history} /> */}
          <div className="main__wrapper">
            <div className="page">
              <div className="level page__header ">
                <div className="level-left">
                  <div className="level-item width-auto">
                    <a
                      className="icon-link"
                      onClick={() =>
                        // this.props.history.push("/admin/dashboard/transaction")
                        this.props.history.push(
                          '/admin/dashboard/transaction?render=true',
                        )
                      }
                    >
                      <Icon path={mdiArrowLeft} size={1} className="btn-icon" />
                    </a>
                  </div>
                  <div className="level-item">
                    <h4 className="page__title">Transaction Details</h4>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <div className="transaction__status">
                      <span>Transaction Status</span>
                      <div
                        style={{
                          backgroundColor:
                            this.state.transactionGroup[this.state.params.id] &&
                            this.state.transactionGroup[this.state.params.id][0]
                              .txn_status === 'Y'
                              ? 'green'
                              : this.state.transactionGroup[
                                  this.state.params.id
                                ] &&
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].txn_status === 'N'
                                ? 'red'
                                : 'orange',
                        }}
                      >
                        {this.state.transactionGroup[this.state.params.id] &&
                        this.state.transactionGroup[this.state.params.id][0]
                          .txn_status === 'Y'
                          ? 'SUCCESS'
                          : this.state.transactionGroup[this.state.params.id] &&
                            this.state.transactionGroup[this.state.params.id][0]
                              .txn_status === 'N'
                            ? 'FAILURE'
                            : 'PENDING'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {this.state.transactionGroup &&
                this.state.transactionGroup[this.state.params.id] && (
                  <div className="page__content mar-20">
                    <div className="columns">
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Card Number
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].acct_number
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">Bank Name</span>
                          <div className="transaction__desc">
                            <span>
                              {this.state.bank_list &&
                                this.state.bank_list[
                                  this.state.transactionGroup[
                                    this.state.params.id
                                  ][0].issuer_id
                                ][0].bank_name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">Card Union</span>
                          <div className="transaction__desc">
                            <span>
                              {this.state.cardUnion &&
                                this.state.cardUnion[
                                  this.state.transactionGroup[
                                    this.state.params.id
                                  ][0].card_union
                                ]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">Time Stamp</span>
                          <div className="transaction__desc">
                            <span>
                              {new Date(
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].date_time,
                              ).toDateString()}{' '}
                              |{' '}
                              {new Date(
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].date_time,
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Merchant Name
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].merchant_name
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Merchant ID
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].merchant_id
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">Card Type</span>
                          <div className="transaction__desc">
                            <span>
                              {this.state.transactionGroup[
                                this.state.params.id
                              ][0].card_type == 'C'
                                ? 'Credit'
                                : 'Debit'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Transaction Type
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {
                                this.state.transaction_type[
                                  this.state.transactionGroup[
                                    this.state.params.id
                                  ][0].transaction_type
                                ]
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Case Management{' '}
                            <span className="text-warning">(View)</span>
                          </span>
                          <div className="transaction__desc">
                            <span> </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">OTP Status</span>
                          <div className="transaction__desc">
                            <span>
                              {this.state.transactionGroup[
                                this.state.params.id
                              ][0].txn_status === 'Y'
                                ? 'SUCCESS'
                                : this.state.transactionGroup[
                                    this.state.params.id
                                  ][0].txn_status === 'N'
                                  ? 'FAILURE'
                                  : 'PENDING'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Transaction Amount
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].txn_amount
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Data Center
                          </span>
                          <div className="transaction__desc">
                            <span>Primary </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Error Description
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {this.state.transactionGroup[
                                this.state.params.id
                              ][0].txn_status === 'Y'
                                ? ''
                                : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Authentication flow type{' '}
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {' '}
                              {
                                this.state.transactionGroup[
                                  this.state.params.id
                                ][0].auth_flow_type
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Environment Details
                          </span>
                          <div className="transaction__desc">
                            <span>Production</span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="transaction__info">
                          <span className="transaction__title">
                            Device Channel
                          </span>
                          <div className="transaction__desc">
                            <span>
                              {this.state.transactionGroup[
                                this.state.params.id
                              ][0].device_channel == '2'
                                ? 'BROWSER'
                                : 'APP'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              <div className="page__content ">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <h4 className="page__title">
                        Detailed Transaction Output
                      </h4>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item width-auto">
                      <a
                        className="icon-link"
                        onClick={() => {
                          this.setState({
                            fetchReport: !this.state.fetchReport,
                          });
                        }}
                      >
                        <Icon
                          path={
                            this.state.fetchReport
                              ? mdiMinusCircleOutline
                              : mdiPlusCircleOutline
                          }
                          size={1}
                          className="btn-icon"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {this.state.fetchReport && (
                  <React.Fragment>
                    <div className="columns level-item width-auto">
                      <div className="column">
                        <Button
                          type={
                            this.state.type === 'areq' ? 'primary' : 'secondary'
                          }
                          label="AREQ / ARES SECTION"
                          fullwidth={false}
                          onClick={() => this.rreq('areq')}
                        />
                      </div>
                      <div className="column">
                        <Button
                          type={
                            this.state.type === 'creq' ? 'primary' : 'secondary'
                          }
                          label="CREQ / CRES SECTION"
                          fullwidth={false}
                          onClick={() => this.rreq('creq')}
                        />
                      </div>
                      <div className="column">
                        <Button
                          type={
                            this.state.type === 'rreq' ? 'primary' : 'secondary'
                          }
                          label="RREQ / RRES SECTION"
                          fullwidth={false}
                          onClick={() => this.rreq('rreq')}
                        />
                      </div>
                    </div>
                    <div
                      className="ransaction-report is-active"
                      style={{ width: '100%', overflow: 'scroll' }}
                    >
                      <ReactJson src={this.state.TransactionJson} />
                    </div>
                  </React.Fragment>
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
TransactionDetails.propTypes = {
  history: PropTypes.object,
  // location: PropTypes.object,
  globalData: PropTypes.object,
  profile: PropTypes.object,
  // transaction: PropTypes.object,
};
export default TransactionDetails;
