import React from 'react';
// eslint-disable-next-line no-unused-vars
export default function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate() {
      // eslint-disable-next-line no-console
      // console.log("old props:", prevProps);
      // eslint-disable-next-line no-console
      // console.log("new props:", this.props);
    }

    render() {
      const { forwardedRef, ...rest } = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      return <Component forwardedRef={forwardedRef} {...rest} />;
    }
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  return React.forwardRef((props, ref) => (
    <LogProps {...props} forwardedRef={ref} />
  ));
}
