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

//
import { useMoralis } from "react-moralis";
import { FULLABI } from "./FULLABI";
import { CONFIG } from "./../../config";
//
import { notifyError, notifyInfo, notifySuccess } from "./ToastFunction";

const TraxPrax = () => {
  const CardData = [
    {
      image: Image1,
      price: 0.016,
      amount: 25000,
    },
    {
      image: Image2,
      price: 0.03,
      amount: 50000,
    },
    {
      image: Image3,
      price: 0.055,
      amount: 100000,
    },
    {
      image: Image4,
      price: 0.063,
      amount: 125000,
    },
    {
      image: Image5,
      price: 0.11,
      amount: 250000,
    },
    {
      image: Image6,
      price: 0.2,
      amount: 500000,
    },
    {
      image: Image7,
      price: 0.35,
      amount: 1000000,
    },
    {
      image: Image8,
      price: 1.5,
      amount: 5000000,
    },
  ];
  const { Moralis } = useMoralis();

  const buyTrax = async (prc) => {
    const price = Number(prc);

    let options = {
      chain: CONFIG.chainID,
      contractAddress: CONFIG.smart_contract_moosetrax,
      functionName: "buyTraxPax",
      abi: FULLABI,
      msgValue: Moralis.Units.ETH(price),
    };

    try {
      notifyInfo("Your transaction has started");
      const mintTransaction = await Moralis.executeFunction(options);
      console.log(
        "mintTransaction=>",
        mintTransaction,
        "mintTransactionhash",
        mintTransaction.hash
      );
      notifyInfo("Please wait for confirmation");
      await mintTransaction.wait();
      notifySuccess("Please reload after sometime to get the minted NFT");
    } catch (e) {
      console.log("mintError=>", e);
      console.log("traxPAx -----");
      if (e?.message?.includes("Claiming reward has been paused")) {
        notifyError("Buying Trax is Paused at the moment");
      } else {
        notifyError("Oops some problem occured! Please try again later!");
      }
    }
  };

  // TEMP METHOD UNDER REVIEW
  // const buyTrax = async (amt, prc) => {
  //   const amount = Number(amt);
  //   const price = Number(prc);

  //   let options = {
  //     chain: CONFIG.chainID,
  //     contractAddress: CONFIG.smart_contract_moosetrax,
  //     functionName: "buyTraxPax",
  //     abi: ABI.buyTraxPax,
  //     params: {
  //       _amount: amount,
  //     },
  //     msgValue: Moralis.Units.ETH(price),
  //   };

  //   try {
  //     const mintTransaction = await Moralis.executeFunction(options);
  //     console.log(
  //       "mintTransaction=>",
  //       mintTransaction,
  //       "mintTransactionhash",
  //       mintTransaction.hash
  //     );
  //     notifyInfo("Please wait for confirmation");
  //     await mintTransaction.wait();
  //     notifySuccess("Please reload after sometime to get the minted NFT");
  //   } catch (e) {
  //     console.log("mintError=>", e);
  //     console.log("traxPAx -----");
  //     if (e?.message?.includes("Claiming reward has been paused")) {
  //       notifyError("Buying Trax is Paused at the moment");
  //     } else {
  //       notifyError("Oops some problem occured! Please try again later!");
  //     }
  //   }
  // };

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
                <button
                  // onClick={() => buyTrax(data.amount, data.price)}
                  onClick={() => buyTrax(data.price)}
                  className="traxPrice "
                >
                  {data.price} ETH
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TraxPrax;
