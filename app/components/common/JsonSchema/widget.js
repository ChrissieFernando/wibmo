/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable indent */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';
import Button from '../Button';
// import Icon from "@mdi/react";
// import { mdiChevronDown } from "@mdi/js";
export class CustomTextWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // focus: false,
    };
  }
  // const { options } = props;
  // const { color, backgroundColor } = options;

  render() {
    return (
      <div
        className="column"
        style={{
          padding: '0px 3px',
        }}
      >
        <Input
          label={this.props.label}
          type={this.props.options.type || 'text'}
          value={this.props.value}
          id={this.props.id}
          // inputType={this.props.rawErrors ? "invalid" : "primary"}
          // icon={this.props.rawErrors ? "invalid" : "primary"}
          // iconDirection="isright"
          // message={this.props.rawErrors && this.props.rawErrors[0]}
          important={this.props.required}
          placeholder={this.props.placeholder || ''}
          // hasicon={mdiChevronDown}
          // onFocus={() => this.setState({ focus: true })}
          // onBlur={() => this.setState({ focus: false })}
          onChange={event => this.props.onChange(event.target.value)}
          disabled={this.props.options && this.props.options.disable}
        />
      </div>
    );
  }
}

export class CustomDropdownWidget extends React.Component {
  // const { options } = props;
  // const { color, backgroundColor } = options;
  // console.log(props.schema.enum);

  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen,
    }));
  }

  onClickOutsideHandler(event) {
    if (
      this.state.isOpen &&
      !this.toggleContainer.current.contains(event.target)
    ) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div className="column " style={{ padding: '3px' }}>
        <div className="dropdown__title">
          {this.props.schema.title}{' '}
          <span>{this.props.options.required ? '*' : ''}</span>
        </div>
        <div
          className="dropdown dropdown--type3 is-active"
          ref={this.toggleContainer}
        >
          <div className="dropdown-trigger" style={{ color: 'black' }}>
            <Button
              type="dropdown"
              btnstyle={{
                color: this.props.value ? 'rgb(58, 53, 53,0.92)' : '#dee2ed',
              }}
              btnContent={
                this.props.value
                  ? this.props.options.enumOptions.filter(
                      data => data.value == this.props.value,
                    )[0] &&
                    this.props.options.enumOptions.filter(
                      data => data.value == this.props.value,
                    )[0].label
                  : 'Select'
              }
              disable={this.props.options && this.props.options.disable}
              fullwidth
              click={() => {
                this.setState({ isOpen: !this.state.isOpen });
              }}
            />
          </div>
          {this.state.isOpen && (
            <div
              className="dropdown-menu"
              id="dropdown-menu"
              role="menu"
              style={{
                maxHeight: '400px',
                overflow: 'scroll',
                border: '1px solid #dee2ed',
                // width: "20px",
                // padding: "10px",
                marginTop: '2px',
              }}
            >
              <div className="dropdown-content">
                {this.props.options.enumOptions.map((list, i) => (
                  <div
                    className="field"
                    key={`${i + 1}`}
                    style={{ marginBottom: '0px' }}
                  >
                    <input
                      className="is-checkradio is-warning is-small"
                      id={list.value}
                      type="radio"
                      name={this.props.schema.title}
                      defaultChecked={
                        this.props.value == list.value ? 'checked' : ''
                      }
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.props.onChange(list.value);
                        this.setState({ isOpen: !this.state.isOpen });
                      }}
                    />
                    <label
                      className="radio-label"
                      style={{ display: 'inline-block' }}
                      htmlFor={list.value}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.props.onChange(list.value);
                        this.setState({ isOpen: !this.state.isOpen });
                      }}
                    >
                      {list.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export class CustomMultiSelectWidget extends React.Component {
  // const { options } = props;
  // const { color, backgroundColor } = options;
  // console.log(props.schema.enum);

  changed = (e, value) => {
    e.preventDefault();
    if (this.props.value && this.props.value.indexOf(value) > -1) {
      const temp = [...this.props.value];
      temp.splice([...this.props.value].indexOf(value), 1);
      this.props.onChange(temp);
    } else if (this.props.value && this.props.value.indexOf(value) < 0) {
      const temp = [...this.props.value];
      temp.push(value);
      this.props.onChange(temp);
    }
  };

  render() {
    // console.log(this.props);
    return (
      // <div className="columns">
      <div className="column " style={{ padding: '2px' }}>
        <div className="dropdown__title">
          {this.props.schema.title}
          <span>{this.props.options.required ? '*' : ''}</span>
        </div>
        <div
          className="dropdown__products"
          style={{
            maxHeight: '350px',
            overflow: 'scroll',
            border: '1px solid #dee2ed',
            padding: '10px',
            marginTop: '10px',
            borderColor: 'red',
          }}
        >
          {this.props.options.enumOptions.map((list, i) => (
            <div className="field" key={`${i + 1}`}>
              <input
                className="is-checkradio is-warning is-small "
                // id={value}
                type="checkbox"
                name={this.props.schema.title}
                checked={
                  this.props.value &&
                  [...this.props.value].indexOf(list.value) > -1
                }
                onClick={() => this.changed(list.value)}
              />
              <label
                className="checkbox__lable"
                htmlFor={list.value}
                onClick={e => this.changed(e, list.value)}
              >
                {list.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      // </div>
    );
  }
}
export class CustomMultiSelectWidgetWithSearch extends React.Component {
  // const { options } = props;
  // const { color, backgroundColor } = options;
  // console.log(props.schema.enum);
  state = {
    search: '',
  };

  changed = (e, value) => {
    e.preventDefault();
    if (this.props.value && this.props.value.indexOf(value) > -1) {
      const temp = [...this.props.value];
      temp.splice([...this.props.value].indexOf(value), 1);
      this.props.onChange(temp);
    } else if (this.props.value && this.props.value.indexOf(value) < 0) {
      const temp = [...this.props.value];
      temp.push(value);
      this.props.onChange(temp);
    }
  };

  render() {
    // console.log(this.props.options.enumOptions);
    return (
      <div className="column" style={{ padding: '2px' }}>
        <div className="dropdown__title">
          {this.props.schema.title}
          <span>{this.props.options.required ? '*' : ''}</span>
        </div>
        <div
          className="dropdown__products"
          style={{
            // maxHeight: "400px",
            // overflow: "hidden",
            border: '1px solid #dee2ed',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '3px',
            color:
              this.props.options.enumOptions[0] &&
              this.props.options.enumOptions[0].value
                ? ''
                : 'black',
            // backgroundColor: this.props.options.enumOptions[0].value
            //   ? ""
            //   : this.props.options.enumOptions[0].label === "Loading ...."
            //   ? "#fb9d9d"
            //   : "#fb9d9d"
          }}
        >
          {this.props.options.enumOptions[0] &&
            this.props.options.enumOptions[0].value && (
              <div className="column ">
                <Input
                  type="text"
                  placeholder="Search"
                  // inputType={this.props.rawErrors ? "invalid" : "primary"}
                  icon="secondary"
                  inputType="secondary"
                  labelType="secondary"
                  hasicon={<i className="fas fa-search" />}
                  onChange={e => this.setState({ search: e.target.value })}
                  margin="margin"
                />
              </div>
            )}
          <div
            style={{
              maxHeight: '350px',
              overflow: 'scroll',
              padding: '1px',
              marginTop: '1px',
            }}
          >
            {this.props.options.enumOptions
              .filter(
                val =>
                  val &&
                  val.label &&
                  val.label
                    .toLowerCase()
                    .search(
                      this.state.search && this.state.search.toLowerCase(),
                    ) !== -1,
              )
              .map((list, i) => (
                <div className="field" key={`${i + 1}`}>
                  {list.value && (
                    <React.Fragment>
                      <input
                        className="is-checkradio is-warning is-small"
                        // id={value}
                        type="checkbox"
                        name={this.props.schema.title}
                        checked={
                          this.props.value &&
                          [...this.props.value].indexOf(list.value) > -1
                        }
                        onClick={() => this.changed(list.value)}
                      />
                    </React.Fragment>
                  )}
                  <label
                    className="checkbox__lable"
                    htmlFor={list.value}
                    onClick={e => this.changed(e, list.value)}
                  >
                    {list.label}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

CustomTextWidget.defaultProps = {
  options: {
    color: 'red',
  },
};

CustomTextWidget.propTypes = {
  label: PropTypes.any,
  value: PropTypes.any,
  // rawErrors: PropTypes.any,
  id: PropTypes.any,
  required: PropTypes.any,
  onChange: PropTypes.any,
  options: PropTypes.any,
  placeholder: PropTypes.any,
};

CustomDropdownWidget.propTypes = {
  schema: PropTypes.object,
  value: PropTypes.any,
  // id: PropTypes.any,
  required: PropTypes.any,
  onChange: PropTypes.any,
  options: PropTypes.any,
};
CustomMultiSelectWidget.propTypes = {
  schema: PropTypes.object,
  value: PropTypes.any,
  // id: PropTypes.any,
  required: PropTypes.any,
  onChange: PropTypes.any,
  options: PropTypes.any,
};

CustomMultiSelectWidgetWithSearch.propTypes = {
  schema: PropTypes.object,
  value: PropTypes.any,
  // id: PropTypes.any,
  required: PropTypes.any,
  onChange: PropTypes.any,
  options: PropTypes.any,
};
