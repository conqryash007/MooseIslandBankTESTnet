import React, { useEffect, useState } from "react";
import Image1 from "./AmountTraxImages/25k.png";
import Image2 from "./AmountTraxImages/100k.png";
import Image3 from "./AmountTraxImages/200k.png";
import Image4 from "./AmountTraxImages/250k.png";
import Image5 from "./AmountTraxImages/500k.png";
import Image6 from "./AmountTraxImages/750k.png";
import Image7 from "./AmountTraxImages/1m.png";
import Image8 from "./AmountTraxImages/5m.png";
import "../MooseBank/TraxPrax.css";

//
import { useMoralis } from "react-moralis";
import { FULLABI } from "./FULLABI";
import { CONFIG } from "./../../config";
//
import { notifyError, notifyInfo, notifySuccess } from "./ToastFunction";
import DecimalCounter from "./DecimalCounter";

const TraxPrax = ({ pricesPrax, availableToMint }) => {
  const [cardData, setCardData] = useState([
    {
      image: Image1,
      price: "-",
      amount: 25000,
    },
    {
      image: Image2,
      price: "-",
      amount: 100000,
    },
    {
      image: Image3,
      price: "-",
      amount: 200000,
    },
    {
      image: Image4,
      price: "-",
      amount: 250000,
    },
    {
      image: Image5,
      price: "-",
      amount: 500000,
    },
    {
      image: Image6,
      price: "-",
      amount: 750000,
    },
    {
      image: Image7,
      price: "-",
      amount: 1000000,
    },
    {
      image: Image8,
      price: "-",
      amount: 5000000,
    },
  ]);

  useEffect(() => {
    let tempCardData = [
      {
        image: Image1,
        price: 0.015,
        amount: 25000,
      },
      {
        image: Image2,
        price: 0.04,
        amount: 100000,
      },
      {
        image: Image3,
        price: 0.075,
        amount: 200000,
      },
      {
        image: Image4,
        price: 0.1,
        amount: 250000,
      },
      {
        image: Image5,
        price: 0.15,
        amount: 500000,
      },
      {
        image: Image6,
        price: 0.25,
        amount: 750000,
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
    if (pricesPrax.length > 0) {
      tempCardData = tempCardData.map((curr, idx) => {
        curr.price = pricesPrax[idx];
        return curr;
      });
      setCardData(tempCardData);
      console.log(tempCardData);
    }
  }, [pricesPrax]);
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
      notifySuccess("Please reload after sometime to get the minted tokens");
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

  return (
    <div className="trax_prax_bg">
      <div className="flex justify-center mb-10 mt-10">
        <div className=" w-9/12">
          <h5 className="text-center text-xl text-white traxprax-text-1">
            Moose Society Island Bank
          </h5>
          <h1 className="text-center text-7xl font-semibold text-white traxprax-text-2">
            TRAX PAX
          </h1>
          <p className="text-center text-xl para-text traxprax-text-3">
            Haven't earned enough yet and need a few more? Or you just want to
            have some on hand? This is where you can get some extra.
          </p>
        </div>
      </div>

      <div className="pb-5">
        <div className="flex justify-center">
          <p className="text-5xl font-semibold text-white">
            <DecimalCounter value={availableToMint} />
          </p>
        </div>
        <p className="text-center semi-text">TRAX Available To Mint</p>
      </div>

      <div className="flex justify-center mb-20">
        <div className=" grid grid-cols-1 lg:grid-cols-4 w-10/12 gap-y-5">
          {cardData.map((data, indx) => {
            return (
              <div key={indx} className="cards">
                <div className="flex justify-center">
                  <img className=" w-full h-40" src={data.image} alt="" />
                </div>
                <button
                  disabled={pricesPrax.length === 0}
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
