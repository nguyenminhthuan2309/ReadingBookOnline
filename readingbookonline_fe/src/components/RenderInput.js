import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";

const InputField = ({
  name,
  control,
  type,
  placeholder,
  disabled,
  maxLength,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, defaultValue: "" });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...field}
      fullWidth
      className="flex shrink-0 w-full mt-4 px-2 bg-white"
      type={type === "password" && !showPassword ? "password" : "text"}
      placeholder={placeholder}
      disabled={disabled}
      error={!!error} // Nếu có lỗi, chuyển error thành true
      helperText={error?.message || ""} // Hiển thị lỗi từ Yup nếu có
      inputProps={{ maxLength }}
      sx={{ mt: 2, mb: 2 }}
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
};

export default InputField;
