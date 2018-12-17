import React, { Component } from 'react';
import CreateBank from '../../../components/UserAccessManagement/CreateBank';
import Schema from './Schema';

export default class componentName extends Component {
  componentDidMount() {}

  render() {
    return <CreateBank jsonSchema={Schema} />;
  }
}
