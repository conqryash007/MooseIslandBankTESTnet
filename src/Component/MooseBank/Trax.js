import React from "react";
import "./Trax.css";
const Trax = () => {
  return (
    <div className="trax-bg">
      <div>
        <h1 className="text-7xl text-white font-semibold text-center">
          WITHDRAW YOUR TRAX!
        </h1>
        <p className="text-center">
          Each day you hold our collections, you will earn Moose TRAX. For each
          OG Moose you hold, you earn 10 Per Day. For each Mini Moose you hold,
          you earn 15 Per Day.
        </p>
      </div>
      <div className="flex justify-center mt-10 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-3  w-9/12 gap-y-10">
          <div>
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">200+</p>
            </div>
            <p className="text-center">TRAX Earned Per Day Trax</p>
          </div>

          <div className="separator">
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">15</p>
            </div>
            <p className=" text-center">Total TRAX Owned</p>
            <div className="flex justify-center">
              <button className="dashboard px-10 py-5 font-semibold ">
                WITHDRAW TRAX
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">5,000</p>
            </div>
            <p className=" text-center">Total TRAX Owned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trax;
