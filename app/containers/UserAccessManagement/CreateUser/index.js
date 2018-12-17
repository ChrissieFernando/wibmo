import React, { Component } from 'react';
import CreateUser from '../../../components/UserAccessManagement/CreateUser';
import Schema from './Schema';

export default class componentName extends Component {
  componentDidMount() {}

  render() {
    return <CreateUser jsonSchema={Schema} />;
  }
}
