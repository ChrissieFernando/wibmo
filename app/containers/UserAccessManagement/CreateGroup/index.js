import React, { Component } from 'react';
import CreateGroup from '../../../components/UserAccessManagement/CreateGroup';
import Schema from './Schema';

export default class componentName extends Component {
  componentDidMount() {}

  render() {
    return <CreateGroup jsonSchema={Schema} />;
  }
}
