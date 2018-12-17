/* eslint-disable indent */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { mdiChevronDown, mdiMenu, mdiArrowLeft } from '@mdi/js';
import Input from './Input';
import wibmo from '../../images/Wibmo-Logo.png';
import logo from '../../images/header/profile-photo.png';
import footer from '../../images/footer-wibmo-logo.svg';
import { globals, logout } from '../../containers/Login/actions';
import {
  makeSelectLoginProfile,
  makeSelectGlobals,
} from '../../containers/Login/selectors';
// import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      search: '',
    };
  }

  componentDidMount() {
    if (
      this.props.profile &&
      this.props.profile.userBankList &&
      this.props.profile.userBankList.length === 1
    )
      this.props.globals({
        bank_id: this.props.profile.userBankList[0].bank_id,
        bank_name: this.props.profile.userBankList[0].bank_name,
      });
  }

  changeBank = (id, name) => {
    this.props.globals({
      bank_id: id,
      bank_name: name,
    });
    this.setState({
      dropdownVisible: false,
    });
  };

  logout = () => {
    this.props.logout();
  };

  search = e => {
    this.setState({
      search: e.target.value,
    });
  };

  render() {
    return (
      <div
        className="header level is-marginless"
        style={{ backgroundColor: 'white' }}
      >
        <div className="level-left header__left">
          <div
            className="level-item brand"
            onClick={() => {
              this.setState({
                dropdownVisible: false,
                profileVisible: false,
              });
              this.props.globals({
                subMenu: [],
                sideMenu: [],
              });
              this.props.history.push('/');
            }}
          >
            <a
              className="sidebar__link menu"
              onClick={e => {
                e.stopPropagation();
                this.props.globals({
                  showSidebar: !this.props.Globals.showSidebar,
                });
              }}
            >
              <Icon path={mdiMenu} size={1} className="nav-icon" />
              <Icon path={mdiArrowLeft} size={1} className="expand-icon" />
            </a>
            <img className="brand__logo" src={wibmo} />
            <div className="brand__name">ACCOSA 2.0</div>
          </div>
        </div>
        <div className="level-right header__right">
          <div className="level-item">
            <div className="dropdown  is-active">
              <div className="dropdown-trigger">
                <a
                  className="button"
                  onClick={() => {
                    this.props.history &&
                      this.props.history.location.pathname !==
                        '/dashboard/rba-configuration' &&
                      this.props.profile &&
                      this.props.profile.userBankList.length > 1 &&
                      this.setState({
                        dropdownVisible: !this.state.dropdownVisible,
                        profileVisible: false,
                      });
                  }}
                >
                  <div className="profile-img">
                    <img className="brand-img" src={footer} />
                  </div>
                  <span className="dropdown-header-item">
                    {this.props.Globals.bank_name}
                  </span>
                  {this.props.history &&
                    this.props.history.location.pathname !==
                      '/dashboard/rba-configuration' &&
                    this.props.profile &&
                    this.props.profile.userBankList.length > 1 && (
                      <Icon
                        path={mdiChevronDown}
                        size={0.8}
                        className="dropdown__icon display-block"
                      />
                    )}
                </a>
              </div>
              {this.state.dropdownVisible &&
                this.props.history &&
                this.props.history.location.pathname !==
                  '/admin/dashboard/rba-configuration' && (
                  <div
                    className="dropdown-menu shift-left"
                    id="dropdown-menu"
                    role="menu"
                  >
                    <div className="dropdown-content dropdown-content--header">
                      <div>
                        <Input
                          type="text"
                          placeholder="Search by Name and Login ID"
                          icon="secondary"
                          inputType="secondary"
                          labelType="secondary"
                          onChange={this.search}
                          value={this.state.search}
                          hasicon={<i className="fas fa-search" />}
                          margin="margin"
                        />
                      </div>
                      {this.props.profile &&
                        this.props.profile.userBankList &&
                        [
                          // { bank_id: "", bank_name: "Wibmo" },
                          ...(this.props.profile &&
                            this.props.profile.userBankList),
                        ]
                          .filter(
                            bank =>
                              bank.bank_name
                                .toLowerCase()
                                .search(this.state.search.toLowerCase()) !== -1,
                          )
                          .map(bank => (
                            <a
                              key={bank.bank_id}
                              className="dropdown-item"
                              onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.changeBank(bank.bank_id, bank.bank_name);
                              }}
                            >
                              <img className="brand__image" src={wibmo} />
                              <span>{bank.bank_name}</span>
                            </a>
                          ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="level-item">
            <div className="dropdown">
              <div
                className="dropdown-trigger"
                onClick={() => {
                  this.setState({
                    profileVisible: !this.state.profileVisible,
                    dropdownVisible: false,
                  });
                }}
              >
                <a
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <img src={logo} />
                  {/* <Icon path={mdiAccountBox} size={1.8} /> */}
                  <div className="dropdown-header-item">
                    <span>
                      Welcome,{' '}
                      {this.props.profile &&
                        this.props.profile.userProfile &&
                        this.props.profile.userProfile.first_name}
                    </span>
                    {this.props.profile &&
                      this.props.profile.userBankList &&
                      this.props.profile.userBankList.length === 1 && (
                        <span className="text-blue font-12">
                          {this.props.profile &&
                            this.props.profile.userBankList[0].bank_name}
                        </span>
                      )}
                  </div>
                  <Icon
                    path={mdiChevronDown}
                    size={0.8}
                    className="dropdown__icon display-block"
                  />
                </a>
              </div>
              <div
                className="dropdown-menu dropdown--profile"
                id="dropdown-menu"
                role="menu"
                style={{ display: this.state.profileVisible && 'block' }}
              >
                <div className="dropdown-content dropdown-content--header">
                  <div className="dropdown-item dropdown-item--profile">
                    <span className="name">{`${this.props.profile &&
                      this.props.profile.userProfile &&
                      this.props.profile.userProfile.firstName} ${this.props
                      .profile &&
                      this.props.profile.userProfile &&
                      this.props.profile.userProfile.lastName}`}</span>
                    <span className="description">
                      {this.props.profile.userProfile &&
                        this.props.profile.userProfile.email}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      this.props.globals({
                        sideMenu: [],
                        subMenu: [],
                      });
                      this.props.history.push('/dashboard/edituser');
                    }}
                  >
                    <span>Edit Profile</span>
                  </a>
                  <a className="dropdown-item text-red" onClick={this.logout}>
                    <span className="">Sign Out</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectLoginProfile(),
  Globals: makeSelectGlobals(),
});
Header.propTypes = {
  profile: PropTypes.object,
  history: PropTypes.object,
  globals: PropTypes.func,
  logout: PropTypes.func,
  Globals: PropTypes.object,
};

export default connect(
  mapStateToProps,
  { globals, logout },
)(Header);
