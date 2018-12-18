/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiViewDashboard,
  mdiCodeTags,
  mdiCodeBraces,
  mdiMenuLeft,
  mdiAccountGroup,
} from '@mdi/js';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import SidebarConfig from '../../constants/sidebar';
import { globals } from '../../containers/Login/actions';
import {
  makeSelectGlobals,
  makeSelectLoginProfile,
} from '../../containers/Login/selectors';
const icon = {
  '2': mdiCodeTags,
  '1': mdiCodeBraces,
  '100': mdiViewDashboard,
  '101': mdiCodeTags,
  '1002': mdiAccountGroup,
};
class Header extends Component {
  static getDerivedStateFromProps(props) {
    if (props.profile && props.profile.success)
      return {
        sidebar: _.groupBy(
          props.profile && props.profile.screens,
          o => o.product_name,
        ),
      };
    return {};
  }

  sideMenu = index => {
    const sideMenu = [];
    sideMenu[index] = true;
    this.props.globals({
      sideMenu,
    });
  };

  SideNavigation = (id, i, index, e) => {
    e.preventDefault();
    if (this.props.Globals.bank_id) {
      const subMenu = [];
      subMenu[i * 100 + index] = true;
      this.props.globals({
        subMenu,
        showSidebar: false,
      });
      this.props.history.push(SidebarConfig[id]);
    }
  };

  render() {
    return (
      <div
        className={`sidebar ${
          this.props.Globals.showSidebar ? 'sidebar--expand' : ''
        }`}
      >
        <ul className="sidebar__nav">
          <li
            className="sidebar__item"
            onClick={() => {
              this.sideMenu(50);
              const subMenu = [];
              this.props.globals({
                subMenu,
                showSidebar: false,
              });
              this.props.history.push('/admin/dashboard');
            }}
          >
            <a
              className={`sidebar__link sidebar__nosubmenu
              ${this.props.Globals.sideMenu[50] ? 'active' : ''}`}
            >
              <div className="sidebar__bg">
                <Icon path={mdiHome} size={1} className="sidebar__icon" />
              </div>
              <div className="sidebar__tooltip">
                <Icon path={mdiMenuLeft} size={1} />
                <div className="text">Home</div>
              </div>
              <span>HOME</span>
            </a>
          </li>
          {Object.keys(this.state.sidebar).map((value, index) => (
            <React.Fragment key={`${index + 1}`}>
              <li className="sidebar__divider">
                <hr />
              </li>
              <li
                className="sidebar__item"
                onClick={() => this.sideMenu(index)}
              >
                <a
                  className={`sidebar__link ${
                    this.props.Globals.sideMenu[index] ? 'active' : ''
                  }`}
                >
                  <div className="sidebar__bg">
                    <Icon
                      path={
                        icon[this.state.sidebar[value][0].product_id] ||
                        mdiViewDashboard
                      }
                      size={1}
                      className="sidebar__icon"
                    />
                    <div className="sidebar__tooltip">
                      <Icon path={mdiMenuLeft} size={1} />
                      <div className="text">{value.toLocaleUpperCase()}</div>
                    </div>
                  </div>

                  <span>{value.toLocaleUpperCase()}</span>
                </a>
              </li>
              {this.props.Globals.sideMenu[index] && (
                <ul className="sidebar__nav">
                  {_.uniqBy(this.state.sidebar[value], e => e.screen_id).map(
                    (scr, key) => (
                      <li
                        key={`${key + 1}`}
                        className="sidebar__item"
                        onClick={e =>
                          this.SideNavigation(scr.screen_id, index, key, e)
                        }
                      >
                        <a
                          className={`sidebar__link sidebar__link--submenu ${
                            this.props.Globals &&
                            this.props.Globals.subMenu[index * 100 + key]
                              ? 'active'
                              : ''
                          }`}
                        >
                          <div className="sidebar__bg">
                            <Icon
                              path={icon[key + 100] || mdiViewDashboard}
                              size={0.8}
                              className="sidebar__icon"
                            />
                          </div>
                          <div className="sidebar__tooltip sidenav-margin">
                            <Icon path={mdiMenuLeft} size={1} />
                            <div className="text">{scr.screen_name}</div>
                          </div>
                          <span>{scr.screen_name}</span>
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectLoginProfile(),
  Globals: makeSelectGlobals(),
});
Header.propTypes = {
  history: PropTypes.object,
  Globals: PropTypes.object,
  globals: PropTypes.func,
};

export default connect(
  mapStateToProps,
  { globals },
)(Header);
