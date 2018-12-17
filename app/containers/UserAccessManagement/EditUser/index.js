import React, { Component } from 'react';
import EditUser from '../../../components/UserAccessManagement/EditUser';
import Schema from './Schema';

export default class componentName extends Component {
  componentDidMount() {}

  render() {
    return <EditUser jsonSchema={Schema} />;
  }
}
