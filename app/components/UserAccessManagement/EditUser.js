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
import {
  EDIT_USER_URL,
  GET_ALL_BANKS,
  GET_USER_BY_ID,
} from '../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loader: true,
      schema: {},
      bank_id: '',
      // userId: '',
      index: 1,
      // banks: {},
      show: false,
      title: '',
      errorType: '',
      // userDetails: {},
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
              return (
                response.data.listOfBank
                  .filter(data => data.bankParentId === 1000)
                  // .map(data => console.log(data))
                  .map(bank => ({
                    id: bank.bank_id,
                    title: bank.bankName,
                  }))
              );
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

  componentDidMount() {
    const { jsonSchema } = this.props;
    const Json = { ...jsonSchema };

    // eslint-disable-next-line react/prop-types
    const userId = this.props.match.params.user_id;

    Axios.get(GET_USER_BY_ID(userId))
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.data.responseCode == '200' || response.data.success) {
            Json.formData = {
              FirstName:
                (response.data.updatedObject &&
                  response.data.updatedObject.firstName) ||
                '',
              LastName:
                (response.data.updatedObject &&
                  response.data.updatedObject.lastName) ||
                '',
              LoginID:
                (response.data.updatedObject &&
                  response.data.updatedObject.userId) ||
                '',
              MobileCode:
                (response.data.updatedObject &&
                  response.data.updatedObject.telCountryCode) ||
                '',
              MobileNumber:
                (response.data.updatedObject &&
                  response.data.updatedObject.telMobile) ||
                '',
              EmailID:
                (response.data.updatedObject &&
                  response.data.updatedObject.email) ||
                '',
              BankName:
                (response.data.updatedObject &&
                  response.data.updatedObject.bankId) ||
                '',
              BankList:
                (response.data.updatedObject &&
                  response.data.updatedObject.userBankList.map(
                    data => data.BANK_ID,
                  )) ||
                [],
              Status:
                (response.data.updatedObject &&
                  response.data.updatedObject.status) ||
                '',
            };
            this.execute(Json);
          } else {
            this.setState({
              delay: 2000,
              show: true,
              title: response.data.responseDesc,
              errorType: 'danger',
            });
            this.execute(Json);
          }
        }
      })
      .catch(error => {
        if (error.response.status === 500) {
          this.setState({
            delay: 2000,
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
    // TODO: Add other auth dependent params
    // TODO: Move URL to config

    const PAYLOAD = {
      USER_ID: formData.LoginID,
      BANK_ID: '8111',
      USER_PASSWORD: '',
      TEL_COUNTRY_CODE: formData.MobileCode,
      TEL_MOBILE: formData.MobileNumber,
      EMAIL: formData.EmailID,
      FIRST_NAME: formData.FirstName,
      LAST_NAME: formData.LastName,
      STATUS: 'Active',
    };

    Axios.post(EDIT_USER_URL(8111), PAYLOAD)
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
              delay: 2000,
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
            delay: 2000,
            show: true,
            title: 'Internal Server Error',
            errorType: 'danger',
          });
        }
        if (error.response.status === 404) {
          this.setState({
            delay: 2000,
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
                url: GET_ALL_BANKS,
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
          delay={this.state.delay}
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
                        label="Edit User"
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
