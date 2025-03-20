import React from "react";
import { Field } from "redux-form";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const RenderInputField = ({
  label,
  placeholder,
  input,
  disabled,
  meta: { touched, invalid, error },
  type,
  custom,
  variant,
  size,
  InputProps,
  maxLength,
}) => {
  return (
    <TextField
      hiddenLabel
      fullWidth
      disabled={disabled}
      label={label}
      type={type}
      placeholder={placeholder}
      error={touched && invalid}
      variant={variant}
      size={size}
      helperText={touched && error}
      {...input}
      {...custom}
      style={{ marginTop: 20, marginBottom: 20 }}
      InputProps={InputProps}
      inputProps={{ maxLength }}
      value={input.value}
    />
  );
};

const InputField = (props) => {
  return (
    <Field {...props} name={props.input.name} component={RenderInputField} />
  );
};

InputField.propTypes = {
  input: PropTypes.object,
};

export default InputField;
