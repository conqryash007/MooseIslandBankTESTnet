import React, { useState } from "react";
import "./Trax.css";

//
import { useMoralis } from "react-moralis";
import { FULLABI } from "./FULLABI";
import { CONFIG } from "./../../config";
//
import { notifyError, notifyInfo, notifySuccess } from "./ToastFunction";

const Trax = ({ ownedTrax, available, perDayTrax }) => {
  const { Moralis } = useMoralis();

  const [disableBtn, setDisableBtn] = useState(false);

  const withdrawTrax = async () => {
    setDisableBtn(true);
    const amount = Number(available);

    let options = {
      chain: CONFIG.chainID,
      contractAddress: CONFIG.smart_contract_moosetrax,
      functionName: "claimReward",
      abi: FULLABI,
      params: {
        _amount: amount,
      },
    };

    notifyInfo("The transaction has started");

    try {
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
      console.log("TRAX-----");
      if (e?.message?.includes("Claiming reward has been paused")) {
        notifyError("Claiming Trax is Paused at the moment");
      } else {
        notifyError("Oops some problem occured! Please try again later!");
      }
    }
  };

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
              <p className="text-5xl font-semibold text-white">{perDayTrax}</p>
            </div>
            <p className="text-center">TRAX Earned Per Day Trax</p>
          </div>

          <div className="separator">
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">{available}</p>
            </div>
            <p className=" text-center">Total TRAX Owned</p>
            <div className="flex justify-center">
              <button
                disabled={disableBtn}
                onClick={withdrawTrax}
                className="dashboard px-10 py-5 font-semibold "
              >
                WITHDRAW TRAX
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">{ownedTrax}</p>
            </div>
            <p className=" text-center">Total TRAX Owned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trax;
