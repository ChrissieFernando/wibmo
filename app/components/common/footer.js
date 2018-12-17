import React, { Component } from 'react';
import footer from '../../images/footer-wibmo-logo.svg';
class Header extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="footer" style={{ backgroundColor: 'white' }}>
        <div className="footer__copyright">
          Copyright &copy; 2018 Wibmo Inc.
        </div>
        <div className="footer__productof">
          Product of
          <img src={footer} alt="" />
        </div>
      </div>
    );
  }
}

export default Header;
