import React, { useState } from "react";

const fullWidthInput = {
  width: "100%"
};

const widthAuto = {
  width: "auto"
};

function FloatingInput({
  text,
  name,
  onChange,
  value,
  type = "text",
  fullWidth = false,
  max = 100,
  icon = ""
}) {
  const [fieldActive, setFieldActive] = useState(false);

  const activateField = () => {
    setFieldActive(true);
  };

  const disableField = e => {
    if (e.target.value === "") setFieldActive(false);
  };

  return (
    <div className="field-group">
      <label htmlFor={name} className={fieldActive ? "field-active" : ""}>
        {text}
      </label>
      <input
        className="floating-label"
        type={type}
        id={name}
        name={name}
        value={value}
        onFocus={activateField}
        onBlur={disableField}
        onChange={onChange}
        style={fullWidth ? fullWidthInput : widthAuto}
        maxLength={max}
      />
      {icon && <div className="card-number-icon">{icon}</div>}
    </div>
  );
}

export default FloatingInput;
