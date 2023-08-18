import React from "react";
// import { Alert, Button as ButtonCom } from "react-bootstrap";
import { Button as CustomButton } from "reactstrap";

const Button = () => {
  return (
    <div className="d-flex flex-column">
      <CustomButton onClick={() => alert("This is click from the drop")}>
        Click me
      </CustomButton>
    </div>
  );
};

export default Button;
