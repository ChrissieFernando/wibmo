/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-return-assign */
/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import moment from 'moment';
import Axios from 'axios';
import {
  // mdiMenuUp,
  mdiFilter,
} from '@mdi/js';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/footer';
import Notification from '../../../components/common/notification';
import { MAKER_CHECKER_LIST, GET_ALL_BANKS } from '../../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productChecker: false,
    };
    this.state = {
      downloadReport: false,
      tabs: [true],
      show: false,
      title: '',
      banks: {},
      errorType: '',
      makerCheckerList: [],
    };
  }

  endNotification = () => {
    this.setState({
      show: false,
      title: '',
      errorType: '',
    });
  };

  handleView = (e, makerCheckerId) => {
    e.preventDefault();
    this.props.history.push(`/makers-checkers-details/${makerCheckerId}`);
  };

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

    Axios.get(MAKER_CHECKER_LIST(8111, 1))
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          // if (response.data.responseCode == "200") {
          this.setState({
            // show: true,
            // title: "Success",
            // errorType: "success",
            makerCheckerList: [...response.data],
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

  changeTabs2 = index => {
    const tabs = [];
    tabs[index] = true;
    this.setState({
      tabs,
    });
  };

  render() {
    // eslint-disable-next-line no-console
    console.log(this.state);

    return (
      <div className="main">
        <Header headerTypes="secondary" />
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
            <div className="page height-auto">
              <div className="page__header level">
                <div className="level-left">
                  <div className="level-item">
                    <h4 className="page__title">Requests Created</h4>
                  </div>
                </div>
              </div>
              {/* <div className="tabs tabs2 is-boxed is-marginless">
                <ul>
                  <li
                    className={this.state.tabs[0] ? "is-active" : ""}
                    onClick={() => this.changeTabs2(0)}
                  >
                    <a>
                      <span>CHECKER REQUESTS</span>
                    </a>
                  </li>
                  <li
                    className={this.state.tabs[1] ? "is-active" : ""}
                    onClick={() => this.changeTabs2(1)}
                  >
                    <a>
                      <span>MAKER REQUESTS</span>
                    </a>
                  </li>
                </ul>
              </div> */}
              <div className="tabs2-content">
                {this.state.tabs[0] && (
                  <div className="tabs-pane" id="tab1">
                    <div className="level">
                      <div className="level-left width-30">
                        <div className="level-item width-full">
                          <Input
                            type="text"
                            placeholder="Search Request Action"
                            icon="secondary"
                            inputType="secondary"
                            labelType="secondary"
                            hasicon={<i className="fas fa-search" />}
                            margin="margin"
                          />
                        </div>
                      </div>
                      <div className="level-right">
                        <div className="level-item width-100">
                          <div className="dropdown dropdown--type4 is-active">
                            <div className="dropdown-trigger">
                              <Button
                                type="dropdown"
                                btnContent=" 10 per page"
                                fullwidth
                                click={() => {
                                  this.setState(state => ({
                                    reportPage: !state.reportPage,
                                  }));
                                }}
                              />
                            </div>
                            {this.state.reportPage && (
                              <div
                                className="dropdown-menu width-auto"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <a className="dropdown-item">10 per page</a>
                                  <a className="dropdown-item">20 per page</a>
                                  <a className="dropdown-item">30 per page</a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-table border-all">
                      <div className="flex-table__header columns is-marginless padding">
                        <div className="flex-table__cell column lg truncatemd">
                          <Icon path={mdiFilter} size={0.6} />
                          Request Date & Time
                        </div>
                        <div className="flex-table__cell column truncatemd">
                          Request ID
                        </div>
                        <div className="flex-table__cell column xl truncatemd">
                          Request Action
                        </div>
                        <div className="flex-table__cell column md truncatemd">
                          <div className="dropdown is-active">
                            <div className="dropdown-trigger display-flex">
                              <a
                                className="button nopad-lr"
                                onClick={() => {
                                  this.setState(state => ({
                                    bankN: !state.bankN,
                                  }));
                                }}
                              >
                                <Icon path={mdiFilter} size={0.6} />
                              </a>
                              Bank Name
                            </div>
                            {this.state.bankN && (
                              <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <div>
                                    <Input
                                      type="text"
                                      placeholder="Search by Bank ID"
                                      icon="secondary"
                                      inputType="secondary"
                                      labelType="secondary"
                                      hasicon={<i className="fas fa-search" />}
                                      margin="margin"
                                    />
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check1"
                                      type="checkbox"
                                      name="check1"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check1"
                                    >
                                      Axis
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check2"
                                      type="checkbox"
                                      name="check2"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check2"
                                    >
                                      HDFC
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check3"
                                      type="checkbox"
                                      name="check3"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check3"
                                    >
                                      Canara
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check4"
                                      type="checkbox"
                                      name="check4"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check4"
                                    >
                                      Punjab National
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check5"
                                      type="checkbox"
                                      name="check5"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check5"
                                    >
                                      Dhanalakshmi
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check6"
                                      type="checkbox"
                                      name="check6"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check6"
                                    >
                                      SBI
                                    </label>
                                  </div>
                                  <hr className="divider" />
                                  <div className="dropdown__link">
                                    <a>Clear All</a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-table__cell column truncate">
                          <div className="dropdown is-active">
                            <div className="dropdown-trigger display-flex">
                              <a
                                className="button nopad-lr"
                                onClick={() => {
                                  this.setState(state => ({
                                    productChecker: !state.productChecker,
                                  }));
                                }}
                              >
                                <Icon path={mdiFilter} size={0.6} />
                              </a>
                              Product
                            </div>
                            {this.state.productChecker && (
                              <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check1"
                                      type="checkbox"
                                      name="check1"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check1"
                                    >
                                      ACS
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check2"
                                      type="checkbox"
                                      name="check2"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check2"
                                    >
                                      3DS
                                    </label>
                                  </div>
                                  <hr className="divider" />
                                  <div className="dropdown__link">
                                    <a>Clear All</a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-table__cell column lg">
                          Requested By
                        </div>
                        <div className="flex-table__cell column">
                          <div className="dropdown is-active">
                            <div className="dropdown-trigger display-flex">
                              <a
                                className="button nopad-lr"
                                onClick={() => {
                                  this.setState(state => ({
                                    statusFilter: !state.statusFilter,
                                  }));
                                }}
                              >
                                <Icon path={mdiFilter} size={0.6} />
                              </a>
                              Status
                            </div>
                            {this.state.statusFilter && (
                              <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check1"
                                      type="checkbox"
                                      name="check1"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check1"
                                    >
                                      Pending
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check2"
                                      type="checkbox"
                                      name="check2"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check2"
                                    >
                                      Approved
                                    </label>
                                  </div>
                                  <hr className="divider" />
                                  <div className="dropdown__link">
                                    <a>Clear All</a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-table__cell column">Action</div>
                      </div>
                      <div className="flex-table__body">
                        {this.state.makerCheckerList &&
                          this.state.makerCheckerList.map(
                            (makerChecker, key) => (
                              <div
                                key={`${key + key}`}
                                className={
                                  key % 2 === 0
                                    ? 'flex-table__row columns is-marginless odd padding'
                                    : 'flex-table__row columns is-marginless padding'
                                }
                              >
                                <div className="flex-table__cell column lg truncatemd">
                                  {moment(makerChecker.maker_datetime).format(
                                    'DD MMM YYYY | H:MM',
                                  ) || '-'}
                                </div>
                                <div className="flex-table__cell column truncatesm">
                                  {makerChecker.uuid || '-'}
                                </div>
                                <div className="flex-table__cell column xl truncatemd">
                                  {makerChecker.action || '-'}
                                </div>
                                <div className="flex-table__cell column md truncatemd">
                                  {this.state.banks[makerChecker.bank_id] ||
                                    '-'}
                                </div>

                                <div className="flex-table__cell column ">
                                  {makerChecker.product_id || '-'}
                                </div>
                                <div className="flex-table__cell column lg truncate">
                                  {makerChecker.makerId || '-'}
                                </div>
                                <div className="flex-table__cell column ">
                                  <div className="options show">
                                    <span
                                      className={
                                        makerChecker.status === `active`
                                          ? `circle show`
                                          : makerChecker.status === `pending`
                                            ? `circle orange`
                                            : `circle red`
                                      }
                                    />
                                    {/* <div className="tooltips tooltips--checker">
                                <Icon path={mdiMenuUp} size={1} />
                                <span className="tag is-white">Approved</span>
                              </div> */}
                                  </div>
                                </div>
                                <div className="flex-table__cell flex-table__cell--last column ">
                                  <Button
                                    type="primary"
                                    label="VIEW"
                                    fullwidth
                                    onClick={e =>
                                      this.handleView(e, makerChecker.uuid)
                                    }
                                    link="maker-detail"
                                  />
                                </div>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                )}
                {/* {this.state.tabs[1] && (
                  <div className="tabs-pane" id="tab2">
                    <div className="level">
                      <div className="level-left width-30">
                        <div className="level-item width-100">
                          <Input
                            type="text"
                            placeholder="Search Request Action"
                            icon="secondary"
                            inputType="secondary"
                            labelType="secondary"
                            hasicon={<i className="fas fa-search" />}
                            margin="margin"
                          />
                        </div>
                      </div>
                      <div className="level-right">
                        <div className="level-item width-100">
                          <div className="dropdown dropdown--type4 is-active">
                            <div className="dropdown-trigger">
                              <Button
                                type="dropdown"
                                btnContent=" 10 per page"
                                fullwidth={true}
                                click={() => {
                                  this.setState({
                                    reportPage: !this.state.reportPage
                                  });
                                }}
                              />
                            </div>
                            {this.state.reportPage && (
                              <div
                                className="dropdown-menu width-auto"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <a href="#" className="dropdown-item">
                                    10 per page
                                  </a>
                                  <a href="#" className="dropdown-item">
                                    20 per page
                                  </a>
                                  <a href="#" className="dropdown-item">
                                    30 per page
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-table border-all">
                      <div className="flex-table__header columns is-marginless padding">
                        <div className="flex-table__cell column lg">
                          <Icon path={mdiFilter} size={0.6} />
                          Request Date & Time
                        </div>
                        <div className="flex-table__cell column md">
                          Request ID
                        </div>
                        <div className="flex-table__cell column xl">
                          Request Action
                        </div>
                        <div className="flex-table__cell column lg">
                          <div className="dropdown is-active">
                            <div className="dropdown-trigger display-flex">
                              <a
                                className="button nopad-lr"
                                onClick={() => {
                                  this.setState({ bankN: !this.state.bankN });
                                }}
                              >
                                <Icon path={mdiFilter} size={0.6} />
                              </a>
                              Bank Name
                            </div>
                            {this.state.bankN && (
                              <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <div>
                                    <Input
                                      type="text"
                                      placeholder="Search by Bank ID"
                                      icon="secondary"
                                      inputType="secondary"
                                      labelType="secondary"
                                      hasicon={<i className="fas fa-search" />}
                                      margin="margin"
                                    />
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check1"
                                      type="checkbox"
                                      name="check1"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check1"
                                    >
                                      Axis
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check2"
                                      type="checkbox"
                                      name="check2"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check2"
                                    >
                                      HDFC
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check3"
                                      type="checkbox"
                                      name="check3"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check3"
                                    >
                                      Canara
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check4"
                                      type="checkbox"
                                      name="check4"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check4"
                                    >
                                      Punjab National
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check5"
                                      type="checkbox"
                                      name="check5"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check5"
                                    >
                                      Dhanalakshmi
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check6"
                                      type="checkbox"
                                      name="check6"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check6"
                                    >
                                      SBI
                                    </label>
                                  </div>
                                  <hr className="divider" />
                                  <div className="dropdown__link">
                                    <a>Clear All</a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-table__cell column">
                          <div className="dropdown is-active">
                            <div className="dropdown-trigger display-flex">
                              <a
                                className="button nopad-lr"
                                onClick={() => {
                                  this.setState({
                                    product: !this.state.product
                                  });
                                }}
                              >
                                <Icon path={mdiFilter} size={0.6} />
                              </a>
                              Product
                            </div>
                            {this.state.product && (
                              <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check1"
                                      type="checkbox"
                                      name="check1"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check1"
                                    >
                                      ACS
                                    </label>
                                  </div>
                                  <div className="field">
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id="check2"
                                      type="checkbox"
                                      name="check2"
                                      defaultChecked=""
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor="check2"
                                    >
                                      3DS
                                    </label>
                                  </div>
                                  <hr className="divider" />
                                  <div className="dropdown__link">
                                    <a>Clear All</a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-table__cell column">
                          <Icon path={mdiFilter} size={0.6} />
                          Status
                        </div>
                        <div className="flex-table__cell column">Action</div>
                      </div>
                      <div className="flex-table__body">
                        <div className="flex-table__row columns is-marginless odd padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                              <div className="tooltips">
                                <Icon path={mdiMenuUp} size={1} />
                                <span className="tag is-white">Approved</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              fullwidth={true}
                              link="maker-detail"
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless odd padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle red" />
                              <div className="tooltips">
                                <Icon path={mdiMenuUp} size={1} />
                                <span className="tag is-white">Rejected</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless odd padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle orange" />
                              <div className="tooltips">
                                <Icon path={mdiMenuUp} size={1} />
                                <span className="tag is-white">Pending</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless odd padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                              <div className="tooltips">
                                <Icon path={mdiMenuUp} size={1} />
                                <span className="tag is-white">Approved</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless odd padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>

                        <div className="flex-table__row columns is-marginless padding">
                          <div className="flex-table__cell column lg">
                            14 June 2018 | 16:18
                          </div>
                          <div className="flex-table__cell column md">
                            3456789098
                          </div>
                          <div className="flex-table__cell column xl">
                            Please Check the Transaction Amo..
                          </div>
                          <div className="flex-table__cell column lg">
                            Indian Overseas
                          </div>
                          <div className="flex-table__cell column ">ACS</div>
                          <div className="flex-table__cell column ">
                            <div className="options show">
                              <span className="circle" />
                            </div>
                          </div>
                          <div className="flex-table__cell flex-table__cell--last column ">
                            <Button
                              type="primary"
                              label="VIEW"
                              link="maker-detail"
                              fullwidth={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
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
  history: PropTypes.object,
};

export default HomePage;
