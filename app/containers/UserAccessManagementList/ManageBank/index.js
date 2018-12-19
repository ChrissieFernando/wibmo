/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Icon from '@mdi/react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import {
  mdiPlus,
  mdiMenuLeft,
  mdiMenuRight,
  mdiPencil,
  mdiFilePlus,
  mdiMenuUp,
} from '@mdi/js';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/footer';
// import Sidebar from '../../../components/common/sidenav';
import Sidebar from '../../../components/common/Sidebar';
import Notification from '../../../components/common/notification';
import { GET_ALL_BANKS } from '../../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadReport: false,
      show: false,
      title: '',
      errorType: '',
      banks: [],
      products: ['ACS', '3DS', 'RBA'],
    };
    this.state = {
      bucket: false,
    };
  }

  componentDidMount = () => {
    Axios.get(GET_ALL_BANKS)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.data.responseCode == '200') {
            this.setState({
              show: true,
              title: 'Success',
              errorType: 'success',
              banks: [...response.data.listOfBank],
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

  handleEdit = (e, bankId) => {
    e.preventDefault();
    this.props.history.push(`/admin/dashboard/editbank/${bankId}`);
  };

  handleAssignScreens = (e, bankId) => {
    e.preventDefault();
    this.props.history.push(
      `/admin/dashboard/assign-screens-to-bank/${bankId}`,
    );
  };

  render() {
    return (
      <div className="main">
        <Header headerTypes="secondary" history={this.props.history} />
        <Notification
          show={this.state.show}
          title={this.state.title}
          type={this.state.errorType}
          endCallback={this.endNotification}
          notify={this.notify}
        />
        <div className="main__body">
          <Sidebar history={this.props.history} />

          <div className="main__wrapper">
            <div className="page">
              <div className="page__header level">
                <div className="level-left">
                  <div className="level-item">
                    <h4 className="page__title">Manage Banks</h4>
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
                  <div className="level-item width-100">
                    <div className="dropdown dropdown--type3 margin-top0 is-active">
                      <div className="dropdown-trigger">
                        <Button
                          type="primary"
                          label="Create Bank"
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
                            <a className="dropdown-item" href="createbank">
                              <span>XLS</span>
                            </a>
                            <a className="dropdown-item" href="createbank">
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
                  <div className="flex-table__header columns is-marginless">
                    <div className="flex-table__cell column sm">S.No</div>
                    <div className="flex-table__cell column lg">Group Name</div>
                    <div className="flex-table__cell column lg">Bank ID</div>
                    <div className="flex-table__cell column lg">
                      Bucket Names
                    </div>
                    <div className="flex-table__cell column md">Currency</div>
                    <div className="flex-table__cell column xl truncatexl">
                      Products
                    </div>
                    <div className="flex-table__cell column lg" />
                  </div>
                  <div className="flex-table__body">
                    {this.state.banks &&
                      this.state.banks.map((bank, key) => (
                        <div
                          key={`${key + key}`}
                          className={
                            key % 2 === 0
                              ? 'flex-table__row columns is-marginless odd'
                              : 'flex-table__row columns is-marginless '
                          }
                        >
                          <div className="flex-table__cell column sm">
                            {key + 1}
                          </div>
                          <div className="flex-table__cell column lg">
                            {bank.bankName}
                          </div>
                          <div className="flex-table__cell column lg">
                            {bank.bank_id}
                          </div>
                          <div className="flex-table__cell column lg">
                            {bank.bankType}
                          </div>
                          <div className="flex-table__cell column md">
                            {bank.bankCurrency}
                          </div>
                          <div className="flex-table__cell column xl truncatexl">
                            <span className="">ACS, 3DS </span>{' '}
                            <span className="text-blue"> +more</span>
                          </div>
                          <div className="flex-table__cell column lg">
                            {/* <!-- Show class with options class is used only for the demo, can be removed whenever required--> */}
                            <div className="options show">
                              <a href="editbank">
                                <div
                                  className="options__edit"
                                  onClick={e =>
                                    this.handleEdit(e, bank.bank_id)
                                  }
                                >
                                  <Icon path={mdiPencil} size={0.7} />
                                </div>
                              </a>
                              <div className="tooltips edit">
                                <Icon path={mdiMenuUp} size={1} />
                                {/* <span className="tag is-white">Edit</span> */}
                              </div>
                              <a
                                href="assignScreens"
                                onClick={e =>
                                  this.handleAssignScreens(e, bank.bank_id)
                                }
                              >
                                <div className="options__attach">
                                  <Icon path={mdiFilePlus} size={0.7} />
                                </div>
                              </a>
                              <div className="tooltips">
                                <Icon path={mdiMenuUp} size={1} />
                                {/* <span className="tag is-white">Assign</span> */}
                              </div>
                              {/* <a href="">
                                <div className="options__delete">
                                  <Icon path={mdiDelete} size={0.7} />
                                </div>
                              </a>
                              <div className="tooltips delete">
                                <Icon path={mdiMenuUp} size={1} />
                                <span className="tag is-white">Delete</span>
                              </div> */}
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

export default HomePage;
HomePage.propTypes = {
  history: PropTypes.object,
};
