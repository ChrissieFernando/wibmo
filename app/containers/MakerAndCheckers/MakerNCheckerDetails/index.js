/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-return-assign */
/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { mdiArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import Notification from '../../../components/common/notification';
import Button from '../../../components/common/Button';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/footer';
import {
  MAKER_CHECKER_LIST_BY_ID,
  GET_ALL_BANKS,
} from '../../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchReport: true,
      show: false,
      title: '',
      errorType: '',
      banks: {},
      makerChecker: {
        uuid: '11536',
        bank_id: 8111,
        product_id: 1,
        screenId: 0,
        previousDataJson: {
          USER_ID: 'admin@axis',
          BANK_ID: '8111',
          USER_PASSWORD: 'password',
          TEL_COUNTRY_CODE: '+91',
          TEL_MOBILE: '6360271875',
          EMAIL: 'a@wibmo.com (a%40wibmo.com)',
          FIRST_NAME: 'Ark',
          LAST_NAME: 'krishna',
          STATUS: 'Active',
        },
        newDataJson: {
          USER_ID: 'admin@axis',
          BANK_ID: '1000',
          USER_PASSWORD: 'password',
          TEL_COUNTRY_CODE: '+91',
          TEL_MOBILE: '6360271875',
          EMAIL: 'a@wibmo.com (a%40wibmo.com)',
          FIRST_NAME: 'Ark',
          LAST_NAME: 'krishna',
          STATUS: 'Active',
          userBankList: [
            {
              bank_id: 8111,
              bank_name: 'adiba Bank',
            },
            {
              bank_id: 7111,
              bank_name: 'Abc Bank',
            },
          ],
        },
        status: 'active',
        makerId: 'admina@axis',
        maker_datetime: '2018-12-07T09:03:40Z',
        releaseStatus: '',
      },
      rejectModal: false,
      approvalModal: false,
    };
  }

  componentDidMount = () => {
    // =============GET ALL THE BANKS==============

    const bankIdMap = {};
    Axios.get(GET_ALL_BANKS)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.data.responseCode == '200') {
            response.data.listOfBank.map(
              data => (bankIdMap[data.bank_id] = data.bankName),
            );

            this.setState({
              show: true,
              title: 'Success',
              errorType: 'success',
              banks: { ...bankIdMap },
              isEditToastActive: false,
            });
          } else {
            this.setState({
              show: true,
              title: response.data.responseDesc,
              errorType: 'danger',
            });
          }
        }
      })
      .catch(error => {
        if (error.response.status === 500) {
          this.setState({
            show: true,
            title: 'Internal Server Error',
            errorType: 'danger',
          });
        }
        if (error.response.status === 404) {
          this.setState({
            show: true,
            title: 'Server Error',
            errorType: 'danger',
          });
        }
      });

    // eslint-disable-next-line react/prop-types
    const makerCheckerId = { ...this.props.match.params };

    const GET_MAKER_CHECKER_LIST_URL = MAKER_CHECKER_LIST_BY_ID(
      makerCheckerId.makerCheckerId,
    );

    Axios.get(GET_MAKER_CHECKER_LIST_URL)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          // if (response.data.responseCode == "200") {
          this.setState({
            // show: true,
            // title: "Success",
            // errorType: "success",
            makerChecker: { ...response.data[0] },
            // isEditToastActive: false
          });
        } else {
          this.setState({
            show: true,
            title: response.data.responseDesc,
            errorType: 'danger',
          });
        }
        // }
      })
      .catch(error => {
        if (error.response.status === 500) {
          this.setState({
            show: true,
            title: 'Internal Server Error',
            errorType: 'danger',
          });
        }
        if (error.response.status === 404) {
          this.setState({
            show: true,
            title: 'Server Error',
            errorType: 'danger',
          });
        }
      });
  };

  endNotification = () => {
    this.setState({
      show: false,
      title: '',
      errorType: '',
    });
  };

  render() {
    const makerChecker = this.state.makerChecker;

    return (
      <div className="main">
        <Header />
        <Notification
          show={this.state.show}
          title={this.state.title}
          type={this.state.errorType}
          endCallback={this.endNotification}
          notify={this.notify}
        />
        <div className="main__body">
          <Sidebar />
          <div className="main__wrapper">
            <div className="page">
              <div className="level page__header ">
                <div className="level-left">
                  <div className="level-item width-auto">
                    <a className="icon-link">
                      <Icon path={mdiArrowLeft} size={1} className="btn-icon" />
                    </a>
                  </div>
                  <div className="level-item">
                    <h4 className="page__title">
                      Request ID: {makerChecker && makerChecker.bank_id}
                    </h4>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item width-100">
                    <Button
                      type="secondary"
                      label="REJECT"
                      fullwidth
                      click={() => {
                        this.setState({ rejectModal: !this.state.rejectModal });
                      }}
                    />
                  </div>
                  <div className="level-item width-100">
                    <Button
                      type="primary"
                      label="Approve"
                      fullwidth
                      click={() => {
                        this.setState({
                          approvalModal: !this.state.approvalModal,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="page__content mar-20">
                <div className="columns">
                  <div className="column">
                    <div className="transaction__info">
                      <span className="transaction__title">
                        Request Date & Time
                      </span>
                      <div className="transaction__desc">
                        <span>
                          {' '}
                          {moment(makerChecker.maker_datetime).format(
                            'DD MMM YYYY | H:MM',
                          ) || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="column is-two-fifths">
                    <div className="transaction__info">
                      <span className="transaction__title">Request Action</span>
                      <div className="transaction__desc">
                        <span>
                          {(makerChecker && makerChecker.action) || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="transaction__info">
                      <span className="transaction__title">Bank</span>
                      <div className="transaction__desc">
                        <span>
                          {makerChecker &&
                            this.state.banks[makerChecker.bank_id]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="transaction__info">
                      <span className="transaction__title">Product</span>
                      <div className="transaction__desc">
                        <span>{makerChecker && makerChecker.product_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="level page__header ">
                <div className="level-left">
                  <div className="level-item">
                    <h4 className="page__title">Modifications:</h4>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item width-100">
                    <Button
                      type="secondary"
                      label={
                        this.state.fetchReport
                          ? 'SHOW All DETAILS'
                          : 'SHOW MODIFIED ONLY'
                      }
                      fullwidth
                      click={() => {
                        this.setState({ fetchReport: !this.state.fetchReport });
                      }}
                    />
                  </div>
                </div>
              </div>

              {!this.state.fetchReport && (
                <div className="details is-active">
                  <div className="columns">
                    <div className="column bg-white margin-right30">
                      <div className="details__title">Before Change:</div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              First Name:
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.FIRST_NAME}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              Last Name:
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.LAST_NAME}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Login ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.USER_ID}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Email ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.EMAIL}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              Mobile Number
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {`${makerChecker &&
                                  makerChecker.previousDataJson
                                    .TEL_COUNTRY_CODE} ${
                                  makerChecker.previousDataJson.TEL_MOBILE
                                }`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              Bank Name:
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  this.state.banks[
                                    makerChecker.previousDataJson.BANK_ID
                                  ]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column is-half">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Status:</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.STATUS}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="column bg-white">
                      <div className="details__title">After Change:</div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              First Name:
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.newDataJson.FIRST_NAME}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              Last Name:
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.newDataJson.LAST_NAME}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Login ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.newDataJson.USER_ID}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Email ID</span>
                            <div className="transaction__desc">
                              <span>
                                {' '}
                                {makerChecker && makerChecker.newDataJson.EMAIL}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              Mobile Number
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {' '}
                                {`makerChecker &&
                                  makerChecker.newDataJson.TEL_COUNTRY_CODE +
                                    ' ' +
                                    makerChecker.newDataJson.TEL_MOBILE`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info">
                            <span className="transaction__title">
                              Bank Name:
                            </span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  this.state.banks[
                                    makerChecker.newDataJson.BANK_ID
                                  ]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column is-half">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Status:</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.newDataJson.STATUS}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {this.state.fetchReport && (
                <div className="details is-active">
                  <div className="columns">
                    <div className="column bg-white margin-right30">
                      <div className="details__title mar-20">
                        Before Change:
                      </div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Login ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.USER_ID}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Email ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.EMAIL}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column is-half">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Status:</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.previousDataJson.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="column bg-white">
                      <div className="details__title mar-20">After Change:</div>
                      <div className="columns">
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Login ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.newDataJson.USER_ID}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Email ID</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker && makerChecker.newDataJson.EMAIL}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column is-half">
                          <div className="transaction__info bg-blue">
                            <span className="transaction__title">Status:</span>
                            <div className="transaction__desc">
                              <span>
                                {makerChecker &&
                                  makerChecker.newDataJson.STATUS}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Footer />
          </div>
        </div>
        {/* <!-- Approve modal --> */}

        {this.state.approvalModal && (
          <div className="modal is-active">
            <div className="modal-background" />
            <div className="modal-content">
              <div className="modal__title">
                Approve Request ID: {makerChecker && makerChecker.uuid} to:
              </div>
              <div className="columns">
                <div className="column is-one-third">
                  <div className="field">
                    <input
                      className="is-checkradio is-warning is-small"
                      id="radio1"
                      type="radio"
                      name="radio1"
                      defaultChecked="checked"
                    />
                    <label className="radio-label" htmlFor="radio1">
                      Production
                    </label>
                  </div>
                </div>
                <div className="column ">
                  <div className="field">
                    <input
                      className="is-checkradio is-warning is-small"
                      id="radio2"
                      type="radio"
                      name="radio1"
                      defaultChecked="checked"
                    />
                    <label className="radio-label" htmlFor="radio2">
                      Canary
                    </label>
                  </div>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <Button
                    type="secondary"
                    label="CANCEL"
                    fullwidth
                    click={() => {
                      this.setState({
                        approvalModal: !this.state.approvalModal,
                      });
                    }}
                  />
                </div>
                <div className="level-item">
                  <Button
                    type="primary"
                    label="CONFIRM"
                    fullwidth
                    click={() => {
                      this.setState({
                        approvalModal: !this.state.approvalModal,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={() => {
                this.setState({
                  approvalModal: !this.state.approvalModal,
                });
              }}
            />
          </div>
        )}
        {/* <!-- Reject modal --> */}
        {this.state.rejectModal && (
          <div className="modal is-active">
            <div className="modal-background" />
            <div className="modal-content">
              <div className="modal__title margin-left">
                Reject Request ID: {makerChecker && makerChecker.uuid}:
              </div>
              <div className="columns">
                <div className="column is-one-third">
                  <div className="required-label">
                    Comment <span>*</span>
                  </div>
                  <textarea name="" id="" cols="45" rows="5" />
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <Button
                    type="secondary"
                    label="CANCEL"
                    fullwidth
                    click={() => {
                      this.setState({ rejectModal: !this.state.rejectModal });
                    }}
                  />
                </div>
                <div className="level-item">
                  <Button
                    type="primary"
                    label="CONFIRM"
                    fullwidth
                    click={() => {
                      this.setState({ rejectModal: !this.state.rejectModal });
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={() => {
                this.setState({ rejectModal: !this.state.rejectModal });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default HomePage;
