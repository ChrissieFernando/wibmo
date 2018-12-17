/* eslint-disable indent */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import PropTypes from 'prop-types';
// import ReactJson from "react-json-view";
import WrapperComponent from './WrapperComponent';
// import dummyJson from "./dummy";
import {
  CustomTextWidget,
  CustomDropdownWidget,
  CustomMultiSelectWidget,
  CustomMultiSelectWidgetWithSearch,
} from './widget';

const widgets = {
  CustomTextWidget,
  CustomDropdownWidget,
  CustomMultiSelectWidget,
  CustomMultiSelectWidgetWithSearch,
};

function CustomFieldTemplate(props) {
  return (
    <div className={props.classNames}>
      {props.description}
      {props.children}
      <div
        style={{
          marginLeft: '5px',
          marginTop: '5px',
        }}
      >
        {/* props.errors */}
      </div>
      {props.help}
    </div>
  );
}
CustomFieldTemplate.propTypes = {
  classNames: PropTypes.any,
  description: PropTypes.any,
  children: PropTypes.any,
  // errors: PropTypes.any,
  help: PropTypes.any,
};

class JsonForm extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      schema: {},
      json: {},
      base: {},
      initial: true,
      update: true,
    };
  }

  form = ({ formData }) => {
    // console.log(this.props.schema);
    this.setState({
      json: formData,
      schema: this.props.schema,
      initial: false,
    });
    this.props.form(formData);
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.schema &&
      props.schema.time !== state.schema.time &&
      state.initial
    )
      return {
        json: props.schema.formData,
        schema: props.schema,
        base: props.schema,
        update: true,
      };

    return {
      initial: true,
    };
  }

  // eslint-disable-next-line arrow-body-style
  ErrorListTemplate = props => {
    // const { errors } = props;
    // console.log(props);
    // this.props.notify(true);
    return (
      <div style={{ marginBottom: '20px', marginTop: '0px' }}>
        {props.errors.map((error, i) => (
          <li
            style={{
              padding: '10px',
              border: '1px solid red',
              borderRadius: '5px',
              marginBottom: '15px',
              display: 'inline-block',
              width: '47.5%',
              marginRight: i % 2 === 0 ? '30px' : '0px',
              backgroundColor: '#fdcece',
              color: 'black',
            }}
            key={`${i + 1}`}
          >
            {`${i + 1}. `}
            <span style={{ fontWeight: '600', opacity: 0.8 }}>
              {
                this.props.schema.schema.properties[
                  error.property.replace('.', '')
                ].title
              }{' '}
            </span>
            {error.message && error.message.toLowerCase()}
          </li>
        ))}
      </div>
    );
  };
  // error = () => {
  // console.log(err);
  // let uischema = { ...this.props.schema.uiSchema };
  // Object.keys(this.props.schema.schema.properties).map(key => {
  //   if (uischema[key]["ui:options"])
  //     if (uischema[key]["ui:options"].Error)
  //       delete uischema[key]["ui:options"].Error;
  // });
  // err.map(data => {
  //   uischema[data.params.missingProperty]["ui:options"] = {
  //     ...uischema[data.params.missingProperty]["ui:options"],
  //     Error: err[0]
  //   };
  // });
  // let schema = { ...this.props.schema };
  // schema.uiSchema = uischema;
  // this.setState({
  //   schema,
  //   initial: false,
  //   update: true
  // });
  // };
  // shouldComponentUpdate(props, state) {
  //   return state.update;
  // }

  onchange = form => {
    this.props.change(form);
    //   console.log.bind(console, form);
    // this.setState({
    //   json: form.formData,
    //   initial: false,
    //   update: false
    // });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.schema &&
          this.state.schema.schema && (
            <div>
              {this.state.schema &&
                this.state.schema.schema && (
                  <Form
                    ref={this.props.forwardedRef}
                    schema={this.state.schema.schema}
                    FieldTemplate={CustomFieldTemplate}
                    // showErrorList={false}
                    formData={this.state.json}
                    uiSchema={this.state.schema.uiSchema}
                    ErrorList={this.ErrorListTemplate}
                    // onError={onError}
                    widgets={widgets}
                    // ObjectFieldTemplate={ObjectFieldTemplate}
                    onChange={form => this.onchange(form)}
                    onSubmit={this.form}
                    // onError={error => this.error(error)}
                  >
                    <div />
                  </Form>
                )}
              {/* <div style={{ marginTop: "20px" }}>
              <ReactJson src={this.state.json} />
            </div> */}
            </div>
          )}
      </React.Fragment>
    );
  }
}
JsonForm.propTypes = {
  schema: PropTypes.any,
  // submit: PropTypes.any,
  forwardedRef: PropTypes.any,
  form: PropTypes.any,
  change: PropTypes.any,
};
export default WrapperComponent(JsonForm);
