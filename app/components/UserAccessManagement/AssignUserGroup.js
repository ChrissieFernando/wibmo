/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable lines-between-class-members */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import Button from '../common/Button';
import Header from '../common/Header';
import Sidebar from '../common/sidenav';
import Footer from '../common/footer';
import JsonForm from '../common/JsonSchema/form';
import {
  ASSIGN_GROUP_USERS_URL,
  GET_BANK_USER_GROUP,
  GET_GROUP_USERS,
} from '../../utils/requestUrl';
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
          if (
            response.data.responseCode === '200' ||
            response.data.length > 0
          ) {
            if (urldata.key === 'BankName')
              return response.data.listOfBank.map(bank => ({
                id: bank.bank_id,
                title: bank.bankName,
              }));
            if (urldata.key === 'Users')
              return response.data.map(user => ({
                id: user.userId,
                title: `${user.firstName} ${user.lastName}`,
              }));
            if (urldata.key === 'GroupName')
              return response.data.map(group => ({
                id: group.groupId,
                title: group.groupName,
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
        bank_id: json.formData.GroupName,
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
    jsonSchema.api = jsonSchema.api.concat([
      {
        url: GET_BANK_USER_GROUP(8111),
        type: 'dropdown',
        key: 'GroupName',
      },
    ]);

    this.execute(jsonSchema);
  }

  form = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);

    // TODO: Add other auth dependent params
    // TODO: Move URL to config

    // TODO: Remove hardcoded data

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

    Axios.post(ASSIGN_GROUP_USERS_URL, PAYLOAD)
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
    if (e.formData.GroupName !== this.state.bank_id) {
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
          bank_id: e.formData.GroupName,
          index: this.state.index + 1,
        },
        () => {
          this.execute({
            ...this.state.schema,
            formData: { ...e.formData, Users: [] },
            api: [
              {
                // TODO: Remove hardcoded data
                url: GET_GROUP_USERS(
                  e.formData.BankName || 8111,
                  e.formData.GroupName,
                ),
                type: 'multiselect',
                key: 'Users',
              },
            ],
          });
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
                        label="Create Group"
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
  jsonSchema: PropTypes.object,
  history: PropTypes.object,
};
