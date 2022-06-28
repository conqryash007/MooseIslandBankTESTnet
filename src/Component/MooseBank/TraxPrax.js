import React from "react";
import Image1 from "../MooseBank/images/25k.png";
import Image2 from "../MooseBank/images/50k.webp";
import Image3 from "../MooseBank/images/100k.webp";
import Image4 from "../MooseBank/images/125k.webp";
import Image5 from "../MooseBank/images/250k.webp";
import Image6 from "../MooseBank/images/500k.webp";
import Image7 from "../MooseBank/images/1m.webp";
import Image8 from "../MooseBank/images/5m.webp";
import "../MooseBank/TraxPrax.css";
const TraxPrax = () => {
  const CardData = [
    {
      image: Image1,
      price: 0.016,
    },
    {
      image: Image2,
      price: 0.03,
    },
    {
      image: Image3,
      price: 0.055,
    },
    {
      image: Image4,
      price: 0.063,
    },
    {
      image: Image5,
      price: 0.11,
    },
    {
      image: Image6,
      price: 0.2,
    },
    {
      image: Image7,
      price: 0.35,
    },
    {
      image: Image8,
      price: 1.5,
    },
  ];
  return (
    <div className="trax_prax_bg">
      <div className="flex justify-center mb-10 mt-10">
        <div className=" w-9/12">
          <h5 className="text-center text-xl text-white">
            Moose Society Island Bank
          </h5>
          <h1 className="text-center text-7xl font-semibold text-white">
            TRAX PAX
          </h1>
          <p className="text-center text-xl ">
            Haven't earned enough yet and need a few more? Or you just want to
            have some on hand? This is where you can get some extra.
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-20">
        <div className=" grid grid-cols-1 lg:grid-cols-4 w-10/12 gap-y-5">
          {CardData.map((data, indx) => {
            return (
              <div key={indx} className="cards">
                <div className="flex justify-center">
                  <img className=" w-full h-40" src={data.image} alt="" />
                </div>
                <button className="traxPrice ">{data.price} ETH</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TraxPrax;
