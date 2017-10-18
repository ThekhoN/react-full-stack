// SurveyField contains logic to render a single label and input
import React from "react";
export default ({ input, label }) => {
  //   console.log(props);
  return (
    <div>
      <label>{label}</label>
      <input {...input} />
    </div>
  );
};
