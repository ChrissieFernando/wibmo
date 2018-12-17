import React, { Component } from 'react';
import EditBank from '../../../components/UserAccessManagement/EditBank';
import Schema from './Schema';

export default class componentName extends Component {
  componentDidMount() {}

  render() {
    return <EditBank jsonSchema={Schema} />;
  }
}
