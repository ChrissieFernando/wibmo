/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import Axios from 'axios';
import {
  mdiPlus,
  // mdiMenuLeft,
  // mdiMenuRight,
  mdiPencil,
  // mdiFilePlus,
  mdiDelete,
} from '@mdi/js';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/footer';
import Notification from '../../../components/common/notification';
import { GET_ALL_USERS_BANK } from '../../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: false,
      show: false,
      title: '',
      errorType: '',
      users: [],
    };
    this.state = {
      bucket: false,
    };
  }

  componentDidMount = () => {
    // TODO: Remove hard coded data

    Axios.get(GET_ALL_USERS_BANK(8111))
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.data.responseCode == '200') {
            this.setState({
              show: true,
              title: 'Success',
              errorType: 'success',
              users: [...response.data.userList],
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
  };

  endNotification = () => {
    this.setState({
      show: false,
      title: '',
      errorType: '',
    });
  };

  handleEdit = (e, userId) => {
    e.preventDefault();
    this.props.history.push(`/admin/dashboard/edituser/${userId}`);
  };

  render() {
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
              <div className="page__header level">
                <div className="level-left">
                  <div className="level-item">
                    <h4 className="page__title">Manage Users</h4>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item width-100">
                    <Input
                      type="text"
                      placeholder="Search by Name and Login ID"
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
                            <a className="dropdown-item">10 per page</a>
                            <a className="dropdown-item">20 per page</a>
                            <a className="dropdown-item">30 per page</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="level-item width-100">
                    <div className="dropdown dropdown--type3 is-right margin-top0 is-active">
                      <div className="dropdown-trigger">
                        <Button
                          type="primary"
                          label="Create User"
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
                            <a className="dropdown-item" href="createuser">
                              <span>XLS</span>
                            </a>
                            <a className="dropdown-item" href="createuser">
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
                    <div className="flex-table__cell column">Name</div>
                    <div className="flex-table__cell column">Login ID</div>
                    <div className="flex-table__cell column is-narrow">
                      Bank Name
                    </div>
                    <div className="flex-table__cell column lg truncate">
                      Email ID
                    </div>
                    <div className="flex-table__cell column lg">
                      Mobile Number
                    </div>
                    <div className="flex-table__cell column">Status</div>
                    <div className="flex-table__cell column" />
                  </div>
                  <div className="flex-table__body">
                    {this.state.users &&
                      this.state.users.map((user, key) => (
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
                            {user.firstName + user.lastName}
                          </div>
                          <div className="flex-table__cell column">
                            {user.userId}
                          </div>
                          <div className="flex-table__cell column is-narrow">
                            {user.bankId}
                          </div>
                          <div className="flex-table__cell column lg truncate">
                            {user.email}
                          </div>
                          <div className="flex-table__cell column lg">
                            {`+ ${user.telCountryCode}  ${user.telMobile}`}
                          </div>
                          <div className="flex-table__cell column">
                            {user.status}
                          </div>
                          <div className="flex-table__cell column">
                            <div className="options">
                              <a href="edituser">
                                <div className="options__edit">
                                  <Icon
                                    path={mdiPencil}
                                    size={0.7}
                                    onClick={e =>
                                      this.handleEdit(e, user.userId)
                                    }
                                  />
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
                {
                  // TODO: Hey dont remove this section this is the pagination nav
                  /* <nav
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
                </nav> */
                }
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
