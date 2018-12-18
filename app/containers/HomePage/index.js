/* eslint-disable jsx-a11y/alt-text */
import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
// import Button from "./common/Button";
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/sidenav';
import Footer from '../../components/common/footer';
import NoConfig from '../../images/alert-decagram.svg';
class HomePage extends PureComponent {
  render() {
    return (
      <div className="main">
        <Header history={this.props.history} />
        <div className="main__body">
          <Sidebar history={this.props.history} />
          <div className="main__wrapper">
            <div className="page">
              <div className="page__content" style={{ height: '600px' }}>
                <div className="page__header level">
                  <div className="level-left">
                    <div className="level-item">
                      <h4 className="page__title">WELCOME TO ACCOSA 2.0</h4>
                    </div>
                  </div>
                </div>
                <div className="page__noconfig">
                  <img src={NoConfig} />
                  <div className="page__text">No Configuration Available</div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  profile: state.toJS().login.profile,
});
HomePage.propTypes = {
  // profile: Proptypes.object,
  history: Proptypes.object,
};
export default connect(mapStateToProps)(HomePage);
