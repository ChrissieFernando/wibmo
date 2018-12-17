/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
// import PropTypes from "prop-types";
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiAt,
  mdiNumeric3BoxOutline,
  mdiCodeTags,
  mdiViewDashboard,
  mdiCodeBraces,
  mdiFileDocumentBoxOutline,
  mdiAccountGroup,
  mdiWorker,
  mdiMenuLeft,
} from '@mdi/js';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: false,
      sideBar: false,
      sideBar2: false,
    };
  }

  render() {
    return (
      <div
        className={`sidebar ${this.state.showSidebar ? 'sidebar--expand' : ''}`}
      >
        <ul className="sidebar__nav">
          {/* <li className="sidebar__item">
            <a
              className="sidebar__link"
              onClick={() => {
                this.setState({
                  showSidebar: !this.state.showSidebar
                });
              }}
            >
              <img className="nav-icon" src="./../../images/sidebar/menu.svg" />
              <img
                className="expand-icon"
                src="./../../images/sidebar/left-arrow.svg"
              />
            </a>
          </li> */}
          <li className="sidebar__item">
            <a className="sidebar__link sidebar__nosubmenu active" href="">
              <div className="sidebar__bg">
                <Icon path={mdiHome} size={1} className="sidebar__icon" />
              </div>
              <div className="sidebar__tooltip">
                <Icon path={mdiMenuLeft} size={1} />
                <div className="text">Home</div>
              </div>
              <span>Home</span>
            </a>
          </li>
          <li className="sidebar__divider">
            <hr />
          </li>
          <li className="sidebar__item">
            <a
              className="sidebar__link"
              onClick={() => {
                this.setState({ sideBar: !this.state.sideBar });
              }}
            >
              <div className="sidebar__bg">
                <Icon path={mdiAt} size={1} className="sidebar__icon" />
              </div>
              <div className="sidebar__tooltip">
                <Icon path={mdiMenuLeft} size={1} />
                <div className="text">ACS Dashboard</div>
              </div>
              <span>ACS Dashboard</span>
            </a>
            {/* <!--Submenu--> */}
            {this.state.sideBar && (
              <ul className="sidebar__nav">
                <li className="sidebar__item">
                  <a className="sidebar__link sidebar__link--submenu" href="">
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiViewDashboard}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <div className="sidebar__tooltip">
                      <Icon path={mdiMenuLeft} size={1} />
                      <div className="text">Dashboard</div>
                    </div>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li className="sidebar__item">
                  <a
                    className="sidebar__link sidebar__link--submenu active"
                    href=""
                  >
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiCodeBraces}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <div className="sidebar__tooltip">
                      <Icon path={mdiMenuLeft} size={1} />
                      <div className="text">RBA Configuration</div>
                    </div>
                    <span>RBA Configuration</span>
                  </a>
                </li>
                <li className="sidebar__item">
                  <a className="sidebar__link sidebar__link--submenu" href="">
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiFileDocumentBoxOutline}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <div className="sidebar__tooltip">
                      <Icon path={mdiMenuLeft} size={1} />
                      <div className="text">Transaction Report</div>
                    </div>
                    <span>Transaction Report</span>
                  </a>
                </li>
                <li className="sidebar__item">
                  <a className="sidebar__link sidebar__link--submenu" href="">
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiAccountGroup}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <span>User Management</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="sidebar__divider">
            <hr />
          </li>
          <li className="sidebar__item">
            <a className="sidebar__link sidebar__nosubmenu" href="">
              <div className="sidebar__bg">
                <Icon
                  path={mdiNumeric3BoxOutline}
                  size={1}
                  className="sidebar__icon"
                />
              </div>
              <span>3DS Server Dashboard</span>
            </a>
          </li>
          <li className="sidebar__divider">
            <hr />
          </li>
          <li className="sidebar__item">
            <a className="sidebar__link sidebar__nosubmenu" href="">
              <div className="sidebar__bg">
                <Icon path={mdiCodeTags} size={1} className="sidebar__icon" />
              </div>
              <span>RBA Configuration</span>
            </a>
          </li>
          <li className="sidebar__divider">
            <hr />
          </li>
          <li className="sidebar__item">
            <a
              className="sidebar__link"
              onClick={() => {
                this.setState({ sideBar2: !this.state.sideBar2 });
              }}
            >
              <div className="sidebar__bg">
                <Icon
                  path={mdiAccountGroup}
                  size={1}
                  className="sidebar__icon"
                />
              </div>
              <span>RBA Configuration</span>
            </a>
            {/* <!--Submenu--> */}
            {this.state.sideBar2 && (
              <ul className="sidebar__nav">
                <li className="sidebar__item">
                  <a className="sidebar__link sidebar__link--submenu" href="">
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiWorker}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li className="sidebar__item">
                  <a
                    className="sidebar__link sidebar__link--submenu active"
                    href=""
                  >
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiWorker}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <span>RBA Configuration</span>
                  </a>
                </li>
                <li className="sidebar__item">
                  <a className="sidebar__link sidebar__link--submenu" href="">
                    <div className="sidebar__bg">
                      <Icon
                        path={mdiWorker}
                        size={0.8}
                        className="sidebar__icon"
                      />
                    </div>
                    <span>Transaction Report</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

Sidebar.propTypes = {};

export default Sidebar;
