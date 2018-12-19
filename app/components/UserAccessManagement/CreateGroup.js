/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
// import Notification from "../components/common/notification";
import {
  CREATE_GROUP_URL,
  GET_BANK_PRODUCTS,
  GET_GROUP_PERMISSIONS,
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
          if (urldata.key === 'Permissions') {
            if (response.data.length === 0)
              return [{ id: '', title: 'No Data Available' }];
            json.formData = {
              ...json.formData,
              Permissions: response.data
                .filter(data => data.isAssigned)
                .map(data => data.permissionId),
            };
            return response.data.map(permission => ({
              id: permission.permissionId,
              title: permission.permissionDescription,
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
        product_id: json.formData.Products,
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

  componentDidMount() {
    const { jsonSchema } = this.props;
    this.execute(jsonSchema);
  }

  form = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);
    // TODO: Add other auth dependent params
    // TODO: Move URL to config

    // const PAYLOAD = {
    //   group_name: formData.GroupName,
    //   bank_id: formData.BankName,
    //   product_id: formData.Products,
    //   permissions: formData.Permissions,
    //   status: "Active",
    //   makerCheckerEnabled: "Inactive",
    //   created_by: "Kiran" // TODO: Link with login id
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
        login_id: 'Shivnath@wibmo.com',
        group_name: formData.GroupName,
        bank_id: formData.BankName,
        product_id: formData.Products,
        listOfPermissionIds: formData.Permissions,
        status: 'Active',
        created_by: 'Kiran',
      },
      listOfPermissionIds: formData.Permissions,
      status: 'active',
      checker_id: '',
      comments: 'Inserting maker checker',
      makerCheckerEnabled: 'Inactive',
      ENTITY_ACTION: 'CREATE_GROUP',
    };

    Axios.post(CREATE_GROUP_URL, PAYLOAD)
      .then(response => {
        if (response.data === 'Success') {
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
        // }
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
            formData: {
              ...e.formData,
              Products: null,
              BankID: e.formData.BankName,
            },
            schema: {
              ...this.state.schema.schema,
              properties: {
                ...e.schema.properties,
                Products: {
                  ...e.schema.properties.Products,
                  enum: [''],
                  enumNames: ['Loading ....'],
                },
                Permissions: {
                  ...e.schema.properties.Permissions,
                  items: {
                    ...e.schema.properties.Permissions.items,
                    enum: [''],
                    enumNames: ['Select a Product'],
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
            formData: {
              ...e.formData,
              Products: null,
              BankID: e.formData.BankName,
              Permissions: [],
            },
            api: [
              {
                url: GET_BANK_PRODUCTS(e.formData.BankName),
                type: 'dropdown',
                key: 'Products',
              },
            ],
          });
          // }, 500000);
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
            formData: { ...e.formData, Permissions: [] },
            schema: {
              ...this.state.schema.schema,
              properties: {
                ...this.state.schema.schema.properties,
                Permissions: {
                  ...this.state.schema.schema.properties.Permissions,
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
          // setTimeout(() => {
          this.execute({
            ...this.state.schema,
            formData: { ...e.formData, Permissions: [] },
            api: [
              {
                // TODO: Remove Hardcoded data
                url: GET_GROUP_PERMISSIONS(e.formData.BankName),
                type: 'multiselect',
                key: 'Permissions',
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
                        label="Create Group"
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
