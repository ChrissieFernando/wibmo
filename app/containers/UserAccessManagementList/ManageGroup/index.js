/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  mdiPlus,
  mdiMenuLeft,
  mdiMenuRight,
  mdiPencil,
  mdiDelete,
} from '@mdi/js';
import Icon from '@mdi/react';
import Axios from 'axios';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/footer';
import Sidebar from '../../../components/common/Sidebar';
import { GET_BANK_USER_GROUP, GET_ALL_BANKS } from '../../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadReport: false,
      banks: {},
      groups: [],
      bucket: false,
    };
  }

  componentDidMount() {
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

    Axios.get(GET_BANK_USER_GROUP(5111))
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          // if (response.data.responseCode == "200") {
          this.setState({
            // show: true,
            // title: "Success",
            // errorType: "success",
            groups: [...response.data],
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
  }

  handleEdit = (e, groupId) => {
    e.preventDefault();
    this.props.history.push(`/admin/dashboard/editgroup/${groupId}`);
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
                    <h4 className="page__title">Manage Groups</h4>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item width-100">
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
                  <div className="level-item width-100">
                    <div className="dropdown dropdown--type4 is-active">
                      <div className="dropdown-trigger">
                        <Button
                          type="dropdown"
                          btnContent="10 per page"
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
                            <a href="" className="dropdown-item">
                              10 per page
                            </a>
                            <a href="" className="dropdown-item">
                              20 per page
                            </a>
                            <a href="" className="dropdown-item">
                              30 per page
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="level-item width-100">
                    <div className="dropdown dropdown--type3 margin-top0 is-active">
                      <div className="dropdown-trigger">
                        <Button
                          type="primary"
                          label="Create Group"
                          withIcon
                          icon={
                            <Icon
                              path={mdiPlus}
                              size={1}
                              className="btn-icon"
                            />
                          }
                          click={() => {
                            this.setState(state => ({
                              downloadReport: !state.downloadReport,
                            }));
                          }}
                        />
                      </div>
                      {this.state.downloadReport && (
                        <div
                          className="dropdown-menu dropdown--profile"
                          id="dropdown-menu"
                          role="menu"
                        >
                          <div className="dropdown-content">
                            <a className="dropdown-item" href="creategroup">
                              <span>XLS</span>
                            </a>
                            <a className="dropdown-item" href="creategroup">
                              <span>CSV</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="page__content is-paddingless">
                <div className="flex-table">
                  <div className="flex-table__header columns">
                    <div className="flex-table__cell column is-narrow">
                      S.No
                    </div>
                    <div className="flex-table__cell column">Group Name</div>
                    <div className="flex-table__cell column">Bank Name</div>
                    <div className="flex-table__cell column">Bank ID</div>
                    <div className="flex-table__cell column">Products</div>
                    <div className="flex-table__cell column is-one-third" />
                  </div>
                  <div className="flex-table__body">
                    {this.state.groups &&
                      this.state.groups.map((group, key) => (
                        <div
                          key={`${key + key}`}
                          className={
                            key % 2 === 0
                              ? 'flex-table__row columns odd'
                              : 'flex-table__row columns'
                          }
                        >
                          <div className="flex-table__cell column is-narrow">
                            {key + 1}
                          </div>
                          <div className="flex-table__cell column">
                            {group.groupName}
                          </div>
                          <div className="flex-table__cell column">
                            {group.bankId}
                          </div>
                          <div className="flex-table__cell column">
                            {this.state.banks && this.state.banks[group.bankId]}
                          </div>
                          <div className="flex-table__cell column">
                            {group.productId}
                          </div>
                          <div className="flex-table__cell column is-one-third">
                            <div className="options">
                              <a href="">
                                <div
                                  className="options__edit"
                                  onClick={e =>
                                    this.handleEdit(e, group.groupId)
                                  }
                                >
                                  <Icon path={mdiPencil} size={0.7} />
                                </div>
                              </a>
                              <a href="">
                                <div className="options__delete">
                                  <Icon path={mdiDelete} size={0.7} />
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <nav
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
                      <a className="pagination-link" aria-label="Goto page 11">
                        11
                      </a>
                    </li>
                    <li>
                      <a className="pagination-link" aria-label="Goto page 12">
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
                </nav>
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
