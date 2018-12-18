import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Axios from 'axios';
import Icon from '@mdi/react';
import TagsInput from 'react-tagsinput';
import moment from 'moment';
import * as _ from 'lodash';
import {
  mdiMinusCircleOutline,
  mdiPlusCircleOutline,
  mdiChevronDown,
  mdiCalendar,
} from '@mdi/js';
import Footer from '../common/footer';
import 'react-tagsinput/react-tagsinput.css';
import { BANK_LIST_API as BankListUrl } from '../../utils/requestUrl';
import Config from '../../constants/transaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Button from '../common/Button';
import Input from '../common/Input';
import Header from '../common/Header';
import Sidebar from '../common/sidenav';
import QueryParamDecoder from '../../utils/Common/QueryParamsDecoder';
const $ = require('jquery');
/* eslint-disable */
React.PropTypes = require('prop-types');
var DatetimeRangePicker = $.extend(
  require('react-bootstrap-datetimerangepicker'),
  {
    _react: React,
  },
);

class Transaction extends Component {
  constructor(props) {
    super(props);
    // console.log(moment['default']());
    this.state = {
      startDate: moment().subtract(30, 'minutes'),
      endDate: moment(),
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [
          moment()
            .subtract(1, 'month')
            .startOf('month'),
          moment()
            .subtract(1, 'month')
            .endOf('month'),
        ],
      },
      bank_list: null,
      cardUnion: {
        R: 'RuPay',
        M: 'Master',
        V: 'VISA',
        D: 'DINER',
        A: 'AMEX',
      },
      loading: false,
      lastFetched: '',
      fetchReport: true,
      dropdown: {},
      transaction_type: ['', 'E-commerce', 'IVR', 'ITP'],
      authentication_type: [
        '',
        'FRICTIONLESS',
        'OTP',
        'STATIC PASSWORD',
        'SINGLE SELECT',
        'MULTIPLE SELECT',
      ],
      merchantID: [],
      transaction: { ...Config['default'] },
      date: {
        from: null,
        to: null,
        from_moment: null,
        to_moment: null,
      },
      tags: [],
    };
  }
  handleChange = tags => {
    this.setState({ tags });
  };
  onChange = dates => {
    this.props.globals({
      date: {
        from: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        from_moment: dates[0],
        to: dates[1].format('YYYY-MM-DD HH:mm:ss'),
        to_moment: dates[1],
      },
    });
    this.setState({
      date: {
        from: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        from_moment: dates[0],
        to: dates[1].format('YYYY-MM-DD HH:mm:ss'),
        to_moment: dates[0],
      },
      startDate: dates[0],
      endDate: dates[1],
    });
  };
  search = e => {
    this.setState({
      search: e.target.value,
    });
  };
  _handleKeyPress = ref => {
    if (ref.key === 'Enter') {
      const merchantID = [...this.state.merchantID];
      merchantID.push(this.state.transaction['merchant_id']);
      const transaction = { ...this.state.transaction };
      transaction['merchant_id'] = '';
      this.setState({
        merchantID,
        transaction,
      });
    }
  };
  handleApply = (event, picker) => {
    // if (interval) clearInterval(interval);
    this.onChange([picker.startDate, picker.endDate], picker);
  };

  fetchReportSubmit = () => {
    if (!this.props.globalData.bank_id) {
      /**
       * @todo Notification
       */
      return;
    } else if (
      !this.props.globalData.date.from ||
      !this.props.globalData.date.to
    ) {
      /**
       * @todo Notification
       */
      return;
    }
    this.setState({
      loading: true,
    });
    this.props.transactionEmpty();
    console.log(this.state.transaction);
    this.props.transactions({
      fromDate: this.props.globalData.date.from,
      toDate: this.props.globalData.date.to,
      issuer_id:
        this.props.globalData.bank_id &&
        this.props.globalData.bank_id.toString(),
      token_id: this.props.profile.userProfile.token_id,
      acct_number: this.state.transaction.card_number,
      acs_txn_id: '',
      bin: '',
      merchant_id: this.state.transaction.merchant_id,
      wibmo_avail_zone: '',
      production_canary: '',
      transaction_type: '',
      acs_version: '',
      txn_status: '',
      card_type: '',
      card_union: '',
      initial: false,
      permissionId_list: [110, 112] || this.props.profile.permissionList,
    });
  };
  static getDerivedStateFromProps(props, state) {
    console.log(props);
    if (
      state.lastFetched !== props.transaction.lastFetched &&
      props.transaction.error &&
      state.initial &&
      !props.transaction.empty
    ) {
      /**
       * @todo Notification
       */
      return {
        fetchReport: true,
        loading: false,
        lastFetched: props.transaction.lastFetched,
      };
    }
    if (
      state.lastFetched !== props.transaction.lastFetched &&
      state.initial &&
      !props.transaction.empty &&
      props.transaction.transaction.length > 0
    ) {
      return {
        fetchReport: false,
        loading: false,
        lastFetched: props.transaction.lastFetched,
      };
    }
    if (
      state.lastFetched !== props.transaction.lastFetched &&
      state.initial &&
      !props.transaction.empty
    ) {
      return {
        loading: false,
        lastFetched: props.transaction.lastFetched,
      };
    }
    return {};
  }
  dropdownChange = (ref, type) => {
    const transaction = { ...this.state.transaction };
    if (ref.target.type === 'text') {
      transaction[ref.target.name] = ref.target.value;
      this.setState({ transaction });
    } else {
      if (ref.target.checked) {
        if (ref.target.id === 'All')
          transaction[ref.target.name] = Config[type].dropdown.map(
            data => data.value,
          );
        else transaction[ref.target.name].push(ref.target.id);
      } else {
        if (ref.target.id === 'All') transaction[ref.target.name] = [];
        else {
          transaction[ref.target.name].splice(
            transaction[ref.target.name].indexOf(ref.target.id),
            1,
          );
          transaction[ref.target.name] = transaction[ref.target.name].filter(
            data => data !== 'All',
          );
        }
      }
      this.setState({ transaction });
    }
  };
  close = (name, key, type) => {
    if (type === 'clear') {
      const transaction = { ...this.state.transaction };
      transaction[key] = [];
      this.setState({ transaction });
    } else {
      const transaction = { ...this.state.transaction };
      transaction[key].splice(transaction[key].indexOf(name), 1);
      this.setState({ transaction });
    }
  };
  componentDidMount() {
    // this.props.transactionEmpty();
    // console.log(QueryParamDecoder(this.props.location.search).render === "true");
    if (
      !(
        QueryParamDecoder(
          (this.props.location && this.props.location.search) || '',
        ).render === 'true'
      )
    ) {
      this.props.transactionEmpty();
      this.setState({
        lastFetched: this.props.transaction.lastFetched,
        initial: true,
        date: {
          from: moment()
            .subtract(30, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss'),
          from_moment: moment().subtract(30, 'minutes'),
          to: moment().format('YYYY-MM-DD HH:mm:ss'),
          to_moment: moment(),
        },
        startDate: moment().subtract(30, 'minutes'),
        endDate: moment(),
        startDate: moment().subtract(30, 'minutes'),
        endDate: moment(),
        transaction: {
          bank_name: 'State Bank of India',
          transaction_type: [],
          card_union: [],
          card_type: [],
          bin_number: [],
          transaction_status: [],
          data_center: [],
          environment: [],
          card_number: '',
          merchant_id: '',
        },
      });

      this.props.globals({
        date: {
          from: moment()
            .subtract(30, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss'),
          from_moment: moment().subtract(30, 'minutes'),
          to: moment().format('YYYY-MM-DD HH:mm:ss'),
          to_moment: moment(),
        },
      });
    } else {
      this.setState({
        fetchReport: false,
        startDate: this.props.globalData.date.from_moment,
        endDate: this.props.globalData.date.to_moment,
      });
    }
    Axios.get(BankListUrl).then(res => {
      this.setState({
        bank_list: _.groupBy(res.data.Result, data => data.bank_id),
      });
    });
    // interval = setInterval(() => {
    //   this.setState({
    //     startDate: moment().subtract(30, "minutes"),
    //     endDate: moment()
    //   });
    // }, 1000);
  }
  render() {
    return (
      <div className="main" onClick={() => this.setState({ dropdown: {} })}>
       <Header history={this.props.history} /> 
        <div className="main__body">
        <Sidebar history={this.props.history} /> 
          <div className="main__wrapper">
            <div className="page">
              <div className="page__content">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <h4 className="page__title">Fetch Transaction Report</h4>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item ">
                      {/*<div className="transaction-date">
                      <div className="transaction-date__item">
                        <span>From</span>
                        <div className="transaction-date__info">
                          <span>12 June 2018</span>
                          <span>|</span>
                          <span>20:18</span>
                        </div>
                      </div>
                      <div className="transaction-date__item">
                        <span>To</span>
                        <div className="transaction-date__info">
                          <span>12 June 2018</span>
                          <span>|</span>
                          <span>20:18</span>
                        </div>
                      </div>
                      <div className="transaction-date__item">
                        <Icon
                          path={mdiCalendar}
                          size={1}
                          className="date-picker"
                        />
                      </div>
    </div>*/}
                      <DatetimeRangePicker
                        timePicker
                        timePicker24Hour
                        showDropdowns
                        // showWeekNumbers
                        opens="center"
                        // autoUpdateInput={true}
                        // ranges={this.state.ranges}
                        linkedCalendars={true}
                        locale={{
                          format: ' DD MMM YYYY | HH:mm ',
                          separator: ' - ',
                          applyLabel: 'Apply',
                          cancelLabel: 'Cancel',
                          fromLabel: 'From',
                          toLabel: 'To',
                        }}
                        // timePickerSeconds
                        applyClass={'button primary-btn padding-btn'}
                        cancelClass={'button secondary-btn padding-btn'}
                        // locale={locale}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onApply={this.handleApply}
                      >
                        <div
                          className="transaction-date"
                          style={{ width: '450px', margin: 'auto' }}
                        >
                          <div
                            className="transaction-date__item"
                            style={{ width: '225px' }}
                          >
                            <span>From</span>
                            <div className="transaction-date__info">
                              <span>
                                {this.state.startDate.format('DD MMM YYYY')}
                              </span>
                              <span>|</span>
                              <span>
                                {this.state.startDate.format('HH:mm')}
                              </span>
                            </div>
                          </div>
                          <div
                            className="transaction-date__item"
                            style={{ width: '225px' }}
                          >
                            <span>To</span>
                            <div className="transaction-date__info">
                              <span>
                                {this.state.endDate.format('DD MMM YYYY')}
                              </span>
                              <span>|</span>
                              <span>{this.state.endDate.format('HH:mm')}</span>
                            </div>
                          </div>
                          <div className="transaction-date__item">
                            <Icon
                              path={mdiCalendar}
                              size={1}
                              className="date-picker"
                            />
                          </div>
                        </div>
                      </DatetimeRangePicker>
                      {/* <RangePicker
                      size="large"
                      placeholder={["From Date", "To Date"]}
                      className="transaction-date__item"
                      format="DD MMMM YYYY | HH:mm"
                      showTime={true}
                      onChange={this.onChange}
                      defaultValue={[
                        this.props.Globals.date.from_moment,
                        this.props.Globals.date.to_moment
                      ]}
                    /> */}
                    </div>
                    <div className="level-item page__expand">
                      <a
                        className="icon-link"
                        onClick={e => {
                          e.stopPropagation();
                          this.setState({
                            fetchReport: !this.state.fetchReport,
                          });
                        }}
                        onBlur={() => this.setState({ dropdown: {} })}
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
                  <div className="transaction-report is-active">
                    <div className="columns">
                      <div className="column">
                        <div className="dropdown__title">Bank Name</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!this.props.globalData.bank_id)
                                  this.setState({
                                    dropdown: {
                                      bankName: !this.state.dropdown.bankName,
                                    },
                                  });
                              }}
                            >
                              <span className="dropdown-trigger-item">
                                {this.props.globalData &&
                                  this.props.globalData.bank_name}
                              </span>
                              {!this.props.globalData.bank_id && (
                                <span className="icon is-small">
                                  <i
                                    className="fas fa-caret-down"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </a>
                          </div>
                          {this.state.dropdown.bankName &&
                            !this.props.globalData.bank_id && (
                              <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                              >
                                <div className="dropdown-content">
                                  {this.props.profile.userBankList.map(bank => (
                                    <a
                                      key={bank.bank_id}
                                      className="dropdown-item"
                                      onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.props.globals({
                                          bank_name: bank.bank_name,
                                          bank_id: bank.bank_id,
                                        });
                                      }}
                                    >
                                      <span>{bank.bank_name}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="column">
                        <Input
                          label="Card Number"
                          type="text"
                          name="card_number"
                          placeholder="1234 5678 9102 2345"
                          value={this.state.transaction.card_number}
                          onChange={ref => this.dropdownChange(ref)}
                        />
                      </div>
                      <div className="column" style={{ paddingTop: '12px' }}>
                        <div className="field" style={{ marginBottom: '26px' }}>
                          <label className={`label secondary-label `}>
                            Merchant ID <span>*</span>
                          </label>
                        </div>
                        <TagsInput
                          value={this.state.tags}
                          onChange={this.handleChange}
                          tagDisplayProp={'afafaf'}
                        />
                        {/*  <Input
                        label="Merchant ID"
                        className="input"
                        type="text"
                        placeholder="12335678, 65432789, +1 more"
                        icon=""
                        name="merchant_id"
                        onKeyPress={this._handleKeyPress}
                        value={this.state.transaction.merchant_id}
                        inputType="secondary"
                        labelType="secondary"
                        onChange={ref => this.dropdownChange(ref)}
                   /> */}
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="dropdown__title">Transaction Type</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    transactionType: !this.state.dropdown
                                      .transactionType,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.transaction_type
                                    .length === 0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.transaction_type
                                  .length !== 0
                                  ? this.state.transaction.transaction_type.filter(
                                      data => data !== 'All',
                                    ).length > 2
                                    ? `${
                                        this.state.transaction
                                          .transaction_type[0]
                                      }, ${
                                        this.state.transaction
                                          .transaction_type[1]
                                      }`
                                    : this.state.transaction.transaction_type
                                        .filter(data => data !== 'All')
                                        .join(', ')
                                  : 'Select a Tranasction Type'}
                                {this.state.transaction.transaction_type.filter(
                                  data => data !== 'All',
                                ).length > 2 && (
                                  <span style={{ color: '#0062c4' }}>
                                    , +
                                    {this.state.transaction.transaction_type.filter(
                                      data => data !== 'All',
                                    ).length - 2}{' '}
                                    More
                                  </span>
                                )}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.transactionType && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Transaction Type'].dropdown.map(
                                  type => (
                                    <div
                                      className="field"
                                      key={type.value}
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <input
                                        className="is-checkradio is-warning is-small"
                                        id={type.value}
                                        type="checkbox"
                                        name="transaction_type"
                                        onChange={ref => {
                                          this.dropdownChange(
                                            ref,
                                            'Transaction Type',
                                          );
                                        }}
                                        checked={
                                          this.state.transaction &&
                                          this.state.transaction[
                                            'transaction_type'
                                          ].indexOf(type.value) !== -1
                                        }
                                      />
                                      <label
                                        className="checkbox__lable"
                                        htmlFor={type.value}
                                      >
                                        {type.value}
                                      </label>
                                    </div>
                                  ),
                                )}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.transaction_type
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(
                                                  name,
                                                  'transaction_type',
                                                );
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.transaction_type
                                      .length > 0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'transaction_type',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="column">
                        <div className="dropdown__title">Card Union</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    cardUnion: !this.state.dropdown.cardUnion,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.card_union.length ===
                                    0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.card_union.length !== 0
                                  ? this.state.transaction.card_union.filter(
                                      data => data !== 'All',
                                    ).length > 2
                                    ? `${
                                        this.state.transaction.card_union[0]
                                      }, ${
                                        this.state.transaction.card_union[1]
                                      }`
                                    : this.state.transaction.card_union
                                        .filter(data => data !== 'All')
                                        .join(', ')
                                  : 'Select a Card Union'}
                                {this.state.transaction.card_union.filter(
                                  data => data !== 'All',
                                ).length > 2 && (
                                  <span style={{ color: '#0062c4' }}>
                                    , +
                                    {this.state.transaction.card_union.filter(
                                      data => data !== 'All',
                                    ).length - 2}{' '}
                                    More
                                  </span>
                                )}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.cardUnion && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Card Union'].dropdown.map(type => (
                                  <div
                                    className="field"
                                    key={type.value}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id={type.value}
                                      type="checkbox"
                                      name="card_union"
                                      onChange={e => {
                                        e.stopPropagation();
                                        this.dropdownChange(e, 'Card Union');
                                      }}
                                      checked={
                                        this.state.transaction &&
                                        this.state.transaction[
                                          'card_union'
                                        ].indexOf(type.value) !== -1
                                      }
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor={type.value}
                                    >
                                      {type.value}
                                    </label>
                                  </div>
                                ))}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.card_union
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(name, 'card_union');
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.card_union.length >
                                      0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'card_union',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="column">
                        <div className="dropdown__title">Card Type</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    cardType: !this.state.dropdown.cardType,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.card_type.length ===
                                    0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.card_type.length !== 0
                                  ? this.state.transaction.card_type.filter(
                                      data => data !== 'All',
                                    ).length > 2
                                    ? `${
                                        this.state.transaction.card_type[0]
                                      }, ${this.state.transaction.card_type[1]}`
                                    : this.state.transaction.card_type
                                        .filter(data => data !== 'All')
                                        .join(', ')
                                  : 'Select a Card Type'}
                                {this.state.transaction.card_type.filter(
                                  data => data !== 'All',
                                ).length > 2 && (
                                  <span style={{ color: '#0062c4' }}>
                                    , +
                                    {this.state.transaction.card_type.filter(
                                      data => data !== 'All',
                                    ).length - 2}{' '}
                                    More
                                  </span>
                                )}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.cardType && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Card Type'].dropdown.map(type => (
                                  <div
                                    className="field"
                                    key={type.value}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id={type.value}
                                      type="checkbox"
                                      name="card_type"
                                      onChange={ref =>
                                        this.dropdownChange(ref, 'Card Type')
                                      }
                                      checked={
                                        this.state.transaction &&
                                        this.state.transaction[
                                          'card_type'
                                        ].indexOf(type.value) !== -1
                                      }
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor={type.value}
                                    >
                                      {type.value}
                                    </label>
                                  </div>
                                ))}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.card_type
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(name, 'card_type');
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.card_type.length >
                                      0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'card_type',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="dropdown__title">BIN Number</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    binNumber: !this.state.dropdown.binNumber,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.bin_number.length ==
                                    0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.bin_number.length !== 0
                                  ? this.state.transaction.bin_number.filter(
                                      data => data !== 'All',
                                    ).length > 2
                                    ? `${
                                        this.state.transaction.bin_number[0]
                                      }, ${
                                        this.state.transaction.bin_number[1]
                                      }`
                                    : this.state.transaction.bin_number
                                        .filter(data => data !== 'All')
                                        .join(', ')
                                  : 'Select a BIN Number'}
                                {this.state.transaction.bin_number.filter(
                                  data => data !== 'All',
                                ).length > 2 && (
                                  <span style={{ color: '#0062c4' }}>
                                    , +
                                    {this.state.transaction.bin_number.filter(
                                      data => data !== 'All',
                                    ).length - 2}{' '}
                                    More
                                  </span>
                                )}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.binNumber && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Bin Number'].dropdown.map(type => (
                                  <div
                                    className="field"
                                    key={type.value}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id={type.value}
                                      type="checkbox"
                                      name="bin_number"
                                      onChange={ref => this.dropdownChange(ref)}
                                      checked={
                                        this.state.transaction &&
                                        this.state.transaction[
                                          'bin_number'
                                        ].indexOf(type.value) !== -1
                                      }
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor={type.value}
                                    >
                                      {type.value}
                                    </label>
                                  </div>
                                ))}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.bin_number
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(name, 'bin_number');
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.bin_number.length >
                                      0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'bin_number',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="column">
                        <div className="dropdown__title">
                          Transaction Status
                        </div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    transactionStatus: !this.state.dropdown
                                      .transactionStatus,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.transaction_status
                                    .length === 0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.transaction_status
                                  .length !== 0
                                  ? this.state.transaction.transaction_status.join(
                                      ', ',
                                    )
                                  : 'Select a Transaction Status'}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.transactionStatus && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Transaction Status'].dropdown.map(
                                  type => (
                                    <div
                                      className="field"
                                      key={type.value}
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <input
                                        className="is-checkradio is-warning is-small"
                                        id={type.value}
                                        type="checkbox"
                                        name="transaction_status"
                                        onChange={ref =>
                                          this.dropdownChange(ref)
                                        }
                                        checked={
                                          this.state.transaction &&
                                          this.state.transaction[
                                            'transaction_status'
                                          ].indexOf(type.value) !== -1
                                        }
                                      />
                                      <label
                                        className="checkbox__lable"
                                        htmlFor={type.value}
                                      >
                                        {type.value}
                                      </label>
                                    </div>
                                  ),
                                )}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.transaction_status
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(
                                                  name,
                                                  'transaction_status',
                                                );
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.transaction_status
                                      .length > 0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'transaction_status',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="column">
                        <div className="dropdown__title">Data Center</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    dataCenter: !this.state.dropdown.dataCenter,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.data_center.length ===
                                    0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.data_center.length !== 0
                                  ? this.state.transaction.data_center.join(
                                      ', ',
                                    )
                                  : 'Select a Data Center'}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.dataCenter && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Data Center'].dropdown.map(type => (
                                  <div
                                    className="field"
                                    key={type.value}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id={type.value}
                                      type="checkbox"
                                      name="data_center"
                                      onChange={ref => this.dropdownChange(ref)}
                                      checked={
                                        this.state.transaction &&
                                        this.state.transaction[
                                          'data_center'
                                        ].indexOf(type.value) !== -1
                                      }
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor={type.value}
                                    >
                                      {type.value}
                                    </label>
                                  </div>
                                ))}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.data_center
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(name, 'data_center');
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.data_center.length >
                                      0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'data_center',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column is-one-third">
                        <div className="dropdown__title">Environment</div>
                        <div className="dropdown dropdown--type3 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  dropdown: {
                                    environment: !this.state.dropdown
                                      .environment,
                                  },
                                });
                              }}
                            >
                              <span
                                className={
                                  this.state.transaction &&
                                  this.state.transaction.environment.length ===
                                    0 &&
                                  'dropdown-trigger-item'
                                }
                              >
                                {this.state.transaction &&
                                this.state.transaction.environment.length !== 0
                                  ? this.state.transaction.environment.join(
                                      ', ',
                                    )
                                  : 'Select a Environment'}
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.dropdown.environment && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                {Config['Environment'].dropdown.map(type => (
                                  <div
                                    className="field"
                                    key={type.value}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <input
                                      className="is-checkradio is-warning is-small"
                                      id={type.value}
                                      type="checkbox"
                                      name="environment"
                                      onChange={ref => this.dropdownChange(ref)}
                                      checked={
                                        this.state.transaction &&
                                        this.state.transaction[
                                          'environment'
                                        ].indexOf(type.value) !== -1
                                      }
                                    />
                                    <label
                                      className="checkbox__lable"
                                      htmlFor={type.value}
                                    >
                                      {type.value}
                                    </label>
                                  </div>
                                ))}
                                <hr className="divider" />
                                <div className="dropdown__footer">
                                  <div className="dropdown__badges">
                                    {this.state.transaction &&
                                      this.state.transaction.environment
                                        .filter(d => d !== 'All')
                                        .map(name => (
                                          <div
                                            className="badges is-rounded"
                                            key={name}
                                          >
                                            {name}
                                            <a
                                              onClick={e => {
                                                e.stopPropagation();
                                                this.close(name, 'environment');
                                              }}
                                            >
                                              X
                                            </a>
                                          </div>
                                        ))}
                                  </div>
                                  {this.state.transaction &&
                                    this.state.transaction.environment.length >
                                      0 && (
                                      <div className="dropdown__link">
                                        <a
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.close(
                                              name,
                                              'environment',
                                              'clear',
                                            );
                                          }}
                                        >
                                          Clear All
                                        </a>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="column is-one-third">
                        <Input
                          label="ACS Transaction ID"
                          type="text"
                          placeholder="ACS100"
                          name="acs_txn_id"
                          value={this.state.transaction.acs_txn_id}
                          onChange={ref => this.dropdownChange(ref)}
                        />
                      </div>
                    </div>

                    <div className="level-right">
                      <div className="level-item width-auto">
                        <Button
                          type="secondary"
                          label="Reset"
                          fullwidth={false}
                          onClick={e => {
                            e.stopPropagation();
                            // this.props.globals({
                            //   bank_name: "Select A Bank",
                            //   bank_id: ""
                            // });
                            this.props.transactionEmpty();
                            this.setState({
                              startDate: moment().subtract(30, 'minutes'),
                              endDate: moment(),
                              transaction: {
                                // bank_name: "State Bank of India",
                                transaction_type: [],
                                card_union: [],
                                card_type: [],
                                bin_number: [],
                                transaction_status: [],
                                data_center: [],
                                environment: [],
                                card_number: '',
                                merchant_id: '',
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="level-item width-auto">
                        <Button
                          type="primary"
                          label={
                            this.state.loading ? 'Loading....' : 'Fetch Report'
                          }
                          fullwidth={false}
                          onClick={e => {
                            e.stopPropagation();
                            this.fetchReportSubmit();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {!this.state.fetchReport && (
                  <div className="transaction-tags is-active">
                    <div className="transaction-tags__elem">
                      <div className="tag">
                        <div className="tag__title">Bank Name</div>
                        <div className="tag__name">
                          {this.props.globalData &&
                            this.props.globalData.bank_name}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">Card Number</div>
                        {this.state.transaction &&
                          this.state.transaction.card_number && (
                            <div key={name} className="tag__name">
                              {this.state.transaction &&
                                this.state.transaction.card_number}
                            </div>
                          )}
                      </div>
                      <div className="tag">
                        <div className="tag__title">Merchant ID</div>
                        {this.state.transaction &&
                          this.state.transaction.merchant_id && (
                            <div className="tag__item">
                              <div key={name} className="tag__name">
                                {this.state.transaction &&
                                  this.state.transaction.merchant_id}
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="tag">
                        <div className="tag__title">Transaction Type</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.transaction_type.map(
                              name => (
                                <div key={name} className="tag__name">
                                  {name}
                                </div>
                              ),
                            )}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">Card Union</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.card_union.map(name => (
                              <div key={name} className="tag__name">
                                {name}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">Card Type</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.card_type.map(name => (
                              <div key={name} className="tag__name">
                                {name}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">BIN Number</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.bin_number.map(name => (
                              <div key={name} className="tag__name">
                                {name}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">Transaction Status</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.transaction_status.map(
                              name => (
                                <div key={name} className="tag__name">
                                  {name}
                                </div>
                              ),
                            )}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">Data Center</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.data_center.map(name => (
                              <div key={name} className="tag__name">
                                {name}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="tag">
                        <div className="tag__title">Environment</div>
                        <div className="tag__item">
                          {this.state.transaction &&
                            this.state.transaction.environment.map(name => (
                              <div key={name} className="tag__name">
                                {name}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {this.props.transaction &&
                this.props.transaction.transaction &&
                this.props.transaction.transaction.length > 0 && (
                  <div className="level page__header mart-30">
                    <div className="level-left">
                      <div className="level-item">
                        <h4 className="page__title">Report Results</h4>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item page__expand">
                        <Input
                          type="text"
                          placeholder="Search by Bank ID"
                          icon="secondary"
                          inputType="secondary"
                          labelType="secondary"
                          value={this.state.search}
                          onChange={this.search}
                          hasicon={<i className="fas fa-search" />}
                          margin="margin"
                        />
                      </div>
                      <div className="level-item width-100">
                        <div className="dropdown dropdown--type4 is-active">
                          <div className="dropdown-trigger">
                            <a
                              className="button button dropdown-btn"
                              aria-haspopup="true"
                              aria-controls="dropdown-menu"
                              onClick={e => {
                                e.stopPropagation();
                                this.setState({
                                  reportPage: !this.state.reportPage,
                                });
                              }}
                            >
                              <span className="dropdown-trigger-item">
                                10 per page
                              </span>
                              <Icon
                                path={mdiChevronDown}
                                size={0.8}
                                className="dropdown__icon"
                              />
                            </a>
                          </div>
                          {this.state.reportPage && (
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                <div className="field">
                                  <input
                                    className="is-checkradio is-warning is-small"
                                    id="radio1"
                                    type="radio"
                                    name="radio1"
                                  />
                                  <label htmlFor="radio1">10 per page</label>
                                </div>
                                <div className="field">
                                  <input
                                    className="is-checkradio is-warning is-small"
                                    id="radio2"
                                    type="radio"
                                    name="radio1"
                                  />
                                  <label htmlFor="radio2">20 per page</label>
                                </div>
                                <div className="field">
                                  <input
                                    className="is-checkradio is-warning is-small"
                                    id="radio3"
                                    type="radio"
                                    name="radio1"
                                  />
                                  <label htmlFor="radio3">30 per page</label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="level-item width-100">
                        <Button
                          type="primary"
                          label=" Download Report"
                          fullwidth={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

              {this.props.transaction &&
                this.props.transaction.transaction &&
                this.props.transaction.transaction.length > 0 && (
                  <div className="page__content is-paddingless">
                    <div className="flex-table">
                      <div className="flex-table__header columns">
                        <div className="flex-table__cell column md">
                          Time Stamp
                        </div>
                        <div className="flex-table__cell column md">
                          Card Number
                        </div>
                        <div className="flex-table__cell column md">
                          Merchant Name
                        </div>
                        <div className="flex-table__cell column">Bank</div>
                        <div className="flex-table__cell column">
                          Trans. Amount
                        </div>
                        <div className="flex-table__cell column">Card Type</div>
                        <div className="flex-table__cell column">
                          Card Union
                        </div>
                        <div className="flex-table__cell column">
                          Trans. Type
                        </div>
                        <div className="flex-table__cell column">
                          Device
                          <br />
                          Channel
                        </div>
                        <div className="flex-table__cell column">Auth.</div>
                        <div className="flex-table__cell column">Status</div>
                      </div>
                      <div className="flex-table__body">
                        {this.props.transaction &&
                          this.props.transaction.transaction
                            .filter(
                              d =>
                                d.acs_txn_id
                                  .toString()
                                  .search(this.state.search) !== -1,
                            )
                            .map((transaction, index) => (
                              <div
                                className={`flex-table__row columns  is-marginless ${
                                  index % 2 == 0 ? 'odd' : ''
                                }`}
                                key={index}
                                onClick={e => {
                                  e.stopPropagation();
                                  this.props.transactionDetail({
                                    fromDate: this.props.globalData.date.from,
                                    toDate: this.props.globalData.date.to,
                                    acs_txn_id: transaction.acs_txn_id,
                                    token_id: this.props.profile.token_id,
                                    acct_number: '',
                                    issuer_id: transaction.issuer_id,
                                    acs_version: '',
                                    txn_status: '',
                                    card_type: '',
                                    card_union: '',
                                  });
                                  this.props.history.push(
                                    `/admin/dashboard/transaction-detail?id=${
                                      transaction.acs_txn_id
                                    }`,
                                  );
                                }}
                              >
                                <div className="flex-table__cell column md">
                                  {new Date(
                                    transaction.date_time,
                                  ).toDateString()}
                                </div>
                                <div className="flex-table__cell column md">
                                  {transaction.acct_number}
                                </div>
                                <div className="flex-table__cell column md">
                                  {transaction.merchant_name}
                                </div>
                                <div className="flex-table__cell column">
                                  {this.state.bank_list &&
                                    this.state.bank_list[
                                      transaction.issuer_id
                                    ] &&
                                    this.state.bank_list[
                                      transaction.issuer_id
                                    ][0].bank_name}
                                </div>
                                <div className="flex-table__cell column right-align">
                                  {transaction.txn_amount}
                                  {/*<span className="currency">USD</span>*/}
                                </div>
                                <div className="flex-table__cell column">
                                  {transaction.card_type === 'C'
                                    ? 'Credit'
                                    : 'Debit'}
                                </div>
                                <div className="flex-table__cell column">
                                  {/*<img src="./../images/mastercard-4.svg" />*/}
                                  {this.state.cardUnion &&
                                    this.state.cardUnion[
                                      transaction.card_union
                                    ]}
                                </div>
                                <div className="flex-table__cell column">
                                  {
                                    this.state.transaction_type[
                                      transaction.transaction_type
                                    ]
                                  }
                                </div>
                                <div className="flex-table__cell column">
                                  {transaction.device_channel
                                    ? transaction.device_channel == '1' ||
                                      transaction.device_channel == '01'
                                      ? 'APP'
                                      : 'BROWSER'
                                    : 'APP'}
                                </div>
                                <div className="flex-table__cell column">
                                  {
                                    // this.state.authentication_type[
                                    transaction.auth_flow_type
                                    // ]
                                  }
                                </div>
                                <div className="flex-table__cell column">
                                  {transaction.txn_status && (
                                    <div
                                      className="oval"
                                      style={{
                                        backgroundColor:
                                          transaction.txn_status === 'Y'
                                            ? 'green'
                                            : transaction.txn_status === 'N'
                                              ? 'red'
                                              : 'orange',
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>

                    {/*<nav
                    className="pagination is-right is-small"
                    role="navigation"
                    aria-label="pagination"
                  >
                    <ul className="pagination-list">
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          <Icon
                            path={mdiMenuLeft}
                            size={1}
                            className="pagination__icon"
                          />
                        </a>
                      </li>
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          1
                        </a>
                      </li>
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          2
                        </a>
                      </li>
                      <li>
                        <a
                          className="pagination-link is-current"
                          aria-label="Page 3"
                          aria-current="page"
                        >
                          3
                        </a>
                      </li>
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          4
                        </a>
                      </li>
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          5
                        </a>
                      </li>
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          6
                        </a>
                      </li>
                      <li>
                        <span className="pagination-ellipsis">&hellip;</span>
                      </li>
                      <li>
                        <a
                          className="pagination-link"
                          aria-label="Goto page 11"
                        >
                          11
                        </a>
                      </li>
                      <li>
                        <a
                          className="pagination-link"
                          aria-label="Goto page 12"
                        >
                          12
                        </a>
                      </li>
                      <li>
                        <a className="pagination-link" aria-label="Goto page 1">
                          <Icon
                            path={mdiMenuRight}
                            size={1}
                            className="pagination__icon"
                          />
                        </a>
                      </li>
                    </ul>
                  </nav>*/}
                  </div>
                )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

Transaction.propTypes = {
  transaction: Proptypes.object,
  transactions: Proptypes.func,
  transactionDetail: Proptypes.func,
  transactionEmpty: Proptypes.func,
  history: Proptypes.object,
  globals: Proptypes.func,
  globalData: Proptypes.object,
  profile: Proptypes.object,
};

export default Transaction;
