/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
import Notification from '../common/notification';
import { CREATE_USER_URL } from '../../utils/requestUrl';

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
            if (urldata.key === 'Products')
              return response.data.listOfProducts.map(product => ({
                id: product.productId,
                title: product.productCode,
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
      // console.log(schema);
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
    // setTimeout(() => {
    this.execute(this.props.jsonSchema);
    // }, 1000);
  }

  endNotification = () => {
    this.setState({
      show: false,
      title: '',
      errorType: '',
    });
  };

  form = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);

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

    Axios.post(CREATE_USER_URL, PAYLOAD)
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
          // setTimeout(() => {
          this.execute({
            ...this.state.schema,
            formData: { ...e.formData, Products: [] },
            api: [
              {
                url: `https://3ds2-ui-acsdemo-bdc1.enstage-uat.com/admin/uam/v1/banks/${
                  e.formData.BankName
                }/products`,
                type: 'multiselect',
                key: 'Products',
              },
            ],
          });
          // }, 500000);
        },
      );
    }
    // this.execute(DummyJson);
  };

  render() {
    // console.log(this.state.schema);
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
                      <Button
                        type="secondary"
                        label="Cancel"
                        fullwidth
                        // link="createbank"
                        // onClick={() => console.log(this.props.history.goBack())}
                      />
                    </div>
                    <div className="level-item width-100">
                      <Button
                        type="primary"
                        label="Create User"
                        fullwidth
                        // link="managebank"
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
                style={{ height: '70vh', overflow: 'scroll' }}
              >
                {/* <Link to="/admin/dashboard/custom/3">admin</Link> */}
                {this.state.loader ? (
                  <div>loading....</div>
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
