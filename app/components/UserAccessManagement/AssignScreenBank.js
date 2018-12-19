/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unused-state */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/sidenav';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
import Notification from '../common/notification';
import {
  GET_BANK_PRODUCTS,
  GET_BANK_SCREENS,
  ASSIGN_SCREENS_BANK_URL,
} from '../../utils/requestUrl';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loader: true,
      schema: {},
      bank_id: '',
      product_id: '',
      index: 1,
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
            if (urldata.key === 'Screens')
              return response.data.listOfScreens.map(screen => ({
                id: screen.screenId,
                title: screen.screenName || '',
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
        product_id: json.formData.Products,
        index: this.state.index + 1,
      });
    });
  };

  componentDidMount() {
    this.execute(this.props.jsonSchema);
  }

  // eslint-disable-next-line no-unused-vars
  form = formData => {
    // TODO: Remove the the login data
    const PAYLOAD = {
      token_id: 'auth007',
      login_id: 'Kiran@wibmo.com',

      bankName: formData.BankName,
      product_id: formData.Products,
      screen_id: formData.Screens,
    };

    Axios.post(ASSIGN_SCREENS_BANK_URL, PAYLOAD)
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
        if (error.response.status === 404) {
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
    if (e.formData.BankName !== this.state.bank_id && e.formData.BankName) {
      this.setState(
        {
          schema: {
            ...this.state.schema,
            formData: { ...e.formData, Products: null },
            schema: {
              ...this.state.schema.schema,
              properties: {
                ...this.state.schema.schema.properties,
                Products: {
                  ...this.state.schema.schema.properties.Products,
                  enum: [''],
                  enumNames: ['Loading ....'],
                },
              },
            },
          },
          index: this.state.index + 1,
        },
        () => {
          this.execute({
            ...this.state.schema,
            formData: { ...e.formData, Products: null },
            api: [
              {
                url: GET_BANK_PRODUCTS(e.formData.BankName),
                type: 'dropdown',
                key: 'Products',
              },
            ],
          });
        },
      );
    } else if (
      e.formData.Products !== this.state.product_id &&
      e.formData.Products
    ) {
      this.setState(
        {
          schema: {
            ...this.state.schema,
            formData: { ...e.formData, Screens: [] },
            schema: {
              ...this.state.schema.schema,
              properties: {
                ...this.state.schema.schema.properties,
                Screens: {
                  ...this.state.schema.schema.properties.Screens,
                  items: {
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
            formData: { ...e.formData, Screens: [] },
            api: [
              {
                url: GET_BANK_SCREENS(e.formData.BankName),
                type: 'multiselect',
                key: 'Screens',
              },
            ],
          });
        },
      );
    }
  };

  endCallback = () => {
    this.setState({
      show: false,
    });
  };

  componentWillUnmount() {
    this.endCallback();
  }

  render() {
    return (
      <div className="main">
        <Notification
          title="Please Fill all the required fields"
          show={this.state.show}
          type="danger"
          endCallback={this.endCallback}
        />
        <Header history={this.props.history} />
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
                        label="Assign"
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
  jsonSchema: PropTypes.object,
  history: PropTypes.object,
};
