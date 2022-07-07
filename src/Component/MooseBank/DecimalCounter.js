import React from "react";
import CountUp from "react-countup";

const DecimalCounter = ({ value }) => {
  return (
    <>
      <CountUp end={Math.floor(value)} />.
      {(value - Math.floor(value)) * 100 > 0 &&
      (value - Math.floor(value)) * 100 < 10 ? (
        `0${Math.floor((value - Math.floor(value)) * 100)}`
      ) : (
        <CountUp end={(value - Math.floor(value)) * 100} />
      )}
    </>
  );
};

export default DecimalCounter;
