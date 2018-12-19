/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Loader from 'react-loader-spinner';

import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
// import DummyJson from '../jsonSchema/createBank';
import Notification from '../common/notification';
import {
  BANK_EDIT_URL,
  GET_BANK_PRODUCTS,
  GET_BANK_BY_ID,
} from '../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      currency: false,
      schema: {},
      toggle: true,
      show: false,
      title: '',
      errorType: '',
      bankId: '',
    };
    this.state = {
      bucket: false,
      loader: true,
    };
    this.submit = this.submit.bind(this);
  }

  execute = json => {
    const dropdownUrl = json.api;
    const schema = { ...json.schema };
    const temp = [];
    dropdownUrl.map((urldata, i) => {
      temp[i] = Axios.get(urldata.url)
        .then(response => {
          if (urldata.key === 'BankName')
            return response.data.listOfBank.map(bank => ({
              id: bank.bank_id,
              title: bank.bankName,
            }));
          if (urldata.key === 'Products')
            return response.data.listOfProducts.map(product => ({
              id: product.productId,
              title: product.productCode,
            }));
          return response.data.map(other => ({
            id: other.title,
            title: other.title,
          }));
        })
        .catch(() => [{ id: '', title: 'Error Loading Data' }]);
      return null;
    });
    Promise.all(temp).then(dropdown => {
      dropdownUrl.map((urldata, i) => {
        if (urldata.type === 'multiselect') {
          schema.properties[urldata.key].items.enum = dropdown[i].map(
            data => data.id,
          );
          schema.properties[urldata.key].items.enumNames = dropdown[i].map(
            data => data.title,
          );
        } else if (urldata.type === 'dropdown') {
          schema.properties[urldata.key].enum = dropdown[i].map(
            data => data.id,
          );
          schema.properties[urldata.key].enumNames = dropdown[i].map(
            data => data.title,
          );
        }
        return null;
      });
      json.schema = schema;
      json.time = new Date();
      this.setState({
        schema: json,
        loader: false,
        toggle: !this.state.toggle,
      });
    });
  };

  // UNSAFE_componentWillReceiveProps(props) {}
  componentDidMount() {
    const { jsonSchema } = this.props;
    // eslint-disable-next-line react/prop-types
    const bankId = this.props.match.params.id;
    jsonSchema.api = [
      {
        // TODO: Remove hardcoded data
        url: GET_BANK_PRODUCTS(8111),
        type: 'multiselect',
        key: 'Products',
      },
    ];
    const GET_BANK_DETAILS = GET_BANK_BY_ID(bankId);

    Axios.get(GET_BANK_DETAILS)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.data.responseCode == '200') {
            jsonSchema.formData = {
              ParentEntityName:
                (response.data.bankDetails &&
                  response.data.bankDetails.parentBankEntity) ||
                '',
              BankName:
                response.data.bankDetails && response.data.bankDetails.bankName,
              BankID:
                response.data.bankDetails && response.data.bankDetails.bank_id,
              // Currency: response.data.bankDetails,
              // Buckets: response.data.bankDetails,
              // BankLogoURL: response.data.bankDetails,
              // Products: response.data.bankDetails
              Products: ['1', '2'],
            };
            this.execute(jsonSchema);
          } else {
            this.setState({
              show: true,
              title: response.data.responseDesc,
              errorType: 'danger',
            });
            this.execute(jsonSchema);
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
  }

  form = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);

    // TODO: Add other auth dependent params

    // const PAYLOAD = {
    //   token_id: "auth007",
    //   login_id: "Kiran@wibmo.com",
    //   bank_id: formData.BankID,
    //   bankName: formData.BankName,
    //   bucket: formData.Buckets,
    //   status: "Active",
    //   bankCurrency: formData.Currency,
    //   product_id: [...formData.Products],
    //   bankLogoUrl: formData.BankLogoURL || ""
    // };

    const PAYLOAD = {
      uuid: '0003',
      bank_id: 8111,
      maker_id: 'adminaxis',
      product_id: 1,
      bankCode: 'HDFC',
      bankName: 'HDFC BANK',
      productCode: 'ACS',
      screen_id: 123,
      previousDataJson: {},
      newDataJson: {
        token_id: 'auth007',
        login_id: 'Shivnath@wibmo.com',
        bankName: formData.BankName,
        bankCode: formData.BankCode,
        bank_id: formData.BankID,
        bucket: formData.Buckets,
        bankCurrency: formData.Currency,
        product_id: [...formData.Products],
        bankLogoUrl: formData.BankLogoURL || '',
      },
      status: 'active',
      checker_id: '',
      comments: 'Inserting maker checker',
      makerCheckerEnabled: 'Inactive',
      ENTITY_ACTION: 'CREATE_GROUP',
    };

    Axios.post(BANK_EDIT_URL(8111), PAYLOAD)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.data.responseCode == '200') {
            this.setState({
              show: true,
              title: 'Success',
              errorType: 'success',
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
      });
  };

  endNotification = () => {
    this.setState({
      show: false,
      title: '',
      errorType: '',
    });
  };

  componentWillUnmount() {
    this.endNotification();
  }

  submit = e => {
    this.myRef.current.onSubmit(e);
  };

  change = () => {};

  render() {
    return (
      <div className="main">
        <Header history={this.props.history} />
        <Notification
          show={this.state.show}
          title={this.state.title}
          type={this.state.errorType}
          endCallback={this.endNotification}
        />
        <div className="main__body">
          <Sidebar history={this.props.history} />
          <div className="main__wrapper">
            <div className="page">
              <div className="page__header level">
                <div className="level-left">
                  <div className="level-item">
                    <h4 className="page__title">
                      {this.state.schema && this.state.schema.title}
                    </h4>
                  </div>
                </div>
                {
                  <div className="level-right">
                    <div className="level-item width-100">
                      <Button type="secondary" label="Cancel" fullwidth />
                    </div>
                    <div className="level-item width-100">
                      <Button
                        type="primary"
                        label="Edit Bank"
                        fullwidth
                        click={e => {
                          e.preventDefault();
                          this.submit(e);
                        }}
                      />
                    </div>
                  </div>
                }
              </div>
              <div
                className="page__content"
                style={{ minHeight: '70vh', overflow: 'scroll' }}
              >
                {this.state.loader ? (
                  <Loader
                    type="Puff"
                    color="#00BFFF"
                    height="100"
                    width="100"
                  />
                ) : (
                  <div style={{ marginLeft: '2%' }}>
                    {this.state.toggle ? (
                      <JsonForm
                        schema={this.state.schema}
                        submit={this.submit}
                        ref={this.myRef}
                        form={this.form}
                        change={this.change}
                      />
                    ) : (
                      <JsonForm
                        schema={this.state.schema}
                        submit={this.submit}
                        ref={this.myRef}
                        form={this.form}
                        change={this.change}
                      />
                    )}
                  </div>
                )}
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
HomePage.propTypes = {
  jsonSchema: PropTypes.object,
};
