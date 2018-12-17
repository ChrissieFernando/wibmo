/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable lines-between-class-members */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
import { EDIT_ASSIGN_GROUP_USERS_URL } from '../../utils/requestUrl';
// import Notification from "../components/common/notification";

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
            if (urldata.key === 'Users')
              return response.data.userList.map(product => ({
                id: product.userId,
                title: `${product.firstName} ${product.lastName}`,
              }));
            return response.data.map(other => ({
              id: other.title,
              title: other.title,
            }));
          }
          if (urldata.key === 'Users') {
            if (response.data.length === 0)
              return [{ id: '', title: 'No Data Available' }];
            return response.data.map(product => ({
              id: product.productId,
              title: product.productCode,
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

  endNotification = () => {
    this.setState({
      show: false,
      title: '',
      errorType: '',
    });
  };

  componentDidMount() {
    // setTimeout(() => {
    this.execute(this.props.jsonSchema);
    // }, 1000);
  }

  form = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);

    // TODO: Add other auth dependent params
    // TODO: Move URL to config

    const PAYLOAD = {
      created_by: 'panditji5',
      users: [
        {
          bankId: 8111,
          user_id: 'admin@1axis',
          userName: 'admin@1axis',
          mobilePhone: false,
          firstName: 'Shiv',
          lastName: 'Tripathi',
          email: 'shiv.tripathi@wibmo.com',
        },
        {
          bankId: 8111,
          user_id: 'admin@2axis',
          userName: 'admin@1axis',
          mobilePhone: false,
          firstName: 'Shiv',
          lastName: 'Tripathi',
          email: 'shiv.tripathi@wibmo.com',
        },
      ],
    };

    // {
    //   "created_by": "panditji5",
    //   "users": [{
    //     "bankId": 8111,
    //     "user_id": "admin@1axis",
    //     "userName": "admin@1axis",
    //     "mobilePhone": false,
    //     "firstName": "Shiv",
    //     "lastName": "Tripathi",
    //     "email": "shiv.tripathi@wibmo.com"
    //   }, {
    //     "bankId": 8111,
    //     "user_id": "admin@2axis",
    //     "userName": "admin@1axis",
    //     "mobilePhone": false,
    //     "firstName": "Shiv",
    //     "lastName": "Tripathi",
    //     "email": "shiv.tripathi@wibmo.com"
    //   }]
    // }

    Axios.post(EDIT_ASSIGN_GROUP_USERS_URL(8111), PAYLOAD)
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
        } else if (error.response && error.response.status === 404) {
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
            formData: { ...e.formData, Users: [] },
            schema: {
              ...this.state.schema.schema,
              properties: {
                ...e.schema.properties,
                Users: {
                  ...e.schema.properties.Users,
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
            formData: { ...e.formData, Users: [] },
            api: [
              {
                url: `https://3ds2-ui-acsdemo-bdc1.enstage-uat.com/admin/uam/v1/admin/users/${
                  e.formData.BankName
                }/getbankusers?limit=11&skip=10`,
                type: 'multiselect',
                key: 'Users',
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
        <Header />
        <div className="main__body">
          <Sidebar />
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
                        label="Update Group"
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
};
