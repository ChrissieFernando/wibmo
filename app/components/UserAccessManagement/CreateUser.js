/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Loader from 'react-loader-spinner';

import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/sidenav';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
import Notification from '../common/notification';
import { CREATE_USER_URL, GET_BANK_PRODUCTS } from '../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loader: true,
      schema: {},
      bank_id: '',
      index: 1,
      show: false,
      title: '',
      errorType: '',
    };
  }

  execute = Json => {
    const json = { ...Json };
    const dropdownUrl = json.api;
    const schema = { ...json.schema };
    const temp = [];
    dropdownUrl.map((urldata, i) => {
      temp[i] = Axios.get(urldata.url)
        .then(response => {
          if (response.data.responseCode === '200') {
            if (urldata.key === 'BankName')
              return response.data.listOfBank.map(bank => ({
                id: bank.bank_id,
                title: bank.bankName,
              }));
            if (urldata.key === 'BankList')
              return response.data.listOfBank
                .filter(data => data.bankParentId === 1000)
                .map(bank => ({
                  id: bank.bank_id,
                  title: bank.bankName,
                }));
            return response.data.map(other => ({
              id: other.title,
              title: other.title,
            }));
          }
          return [{ id: '', title: response.data.responseDesc }];
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
        bank_id: json.formData.BankName,
        index: this.state.index + 1,
      });
    });
  };

  componentDidMount() {
    const { jsonSchema } = this.props;
    this.execute(jsonSchema);
  }

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

  form = formData => {
    // eslint-disable-next-line no-console

    // TODO: Add other auth dependent params
    // TODO: Move URL to config

    // TODO: Remove hardcode data

    // const PAYLOAD = {
    //   USER_ID: formData.LoginID,
    //   BANK_ID: '8111',
    //   USER_PASSWORD: '',
    //   TEL_COUNTRY_CODE: formData.MobileCode,
    //   TEL_MOBILE: formData.MobileNumber,
    //   EMAIL: formData.EmailID,
    //   FIRST_NAME: formData.FirstName,
    //   LAST_NAME: formData.LastName,
    //   STATUS: formData.Status,
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
        USER_ID: formData.LoginID,
        BANK_ID: '8111',
        USER_PASSWORD: '',
        TEL_COUNTRY_CODE: formData.MobileCode,
        TEL_MOBILE: formData.MobileNumber,
        EMAIL: formData.EmailID,
        FIRST_NAME: formData.FirstName,
        LAST_NAME: formData.LastName,
        STATUS: formData.Status,
        userBankList: [
          {
            bank_id: 8111,
            bank_name: 'adiba Bank',
          },
          {
            bank_id: 7111,
            bank_name: 'Abc Bank',
          },
        ],
      },
      status: 'active',
      checker_id: '',
      comments: 'Inserting maker checker',
      // makerCheckerEnabled: "Inactive",
      makerCheckerEnabled: 'Active',
      ENTITY_ACTION: 'CREATE_GROUP',
    };

    Axios.post(CREATE_USER_URL(1000), PAYLOAD)
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
        if (error.response && error.response.status === 500) {
          this.setState({
            show: true,
            title: 'Internal Server Error',
            errorType: 'danger',
          });
        }
        if (error.response && error.response.status === 404) {
          this.setState({
            show: true,
            title: 'Server Error',
            errorType: 'danger',
          });
        }
      });
  };

  submit = e => {
    this.myRef.current.onSubmit(e);
  };

  change = e => {
    if (e.formData.BankName !== this.state.bank_id) {
      this.setState(
        {
          schema: {
            ...this.state.schema,
            formData: { ...e.formData, Products: [] },
            schema: {
              ...this.state.schema.schema,
              properties: {
                ...e.schema.properties,
                Products: {
                  ...e.schema.properties.Products,
                  items: {
                    ...e.schema.properties.Products.items,
                    enum: [''],
                    enumNames: ['Loading ....'],
                  },
                },
              },
            },
          },
          index: this.state.index + 1,
        },
        () => {
          this.execute({
            ...this.state.schema,
            formData: { ...e.formData, Products: [] },
            api: [
              {
                url: GET_BANK_PRODUCTS(e.formData.BankName),
                type: 'multiselect',
                key: 'Products',
              },
            ],
          });
        },
      );
    }
  };

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
                        label="Create User"
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
                    <JsonForm
                      key={this.state.index}
                      schema={this.state.schema}
                      submit={this.submit}
                      ref={this.myRef}
                      form={this.form}
                      change={this.change}
                    />
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

export default HomePage;
HomePage.propTypes = {
  history: PropTypes.object,
  jsonSchema: PropTypes.object,
};
