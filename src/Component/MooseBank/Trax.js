import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import "./Trax.css";

import DecimalCounter from "./DecimalCounter";

//
import { useMoralis } from "react-moralis";
import { FULLABI } from "./FULLABI";
import { CONFIG } from "./../../config";
//
import { notifyError, notifyInfo, notifySuccess } from "./ToastFunction";

const Trax = ({ ownedTrax, available, perDayTrax, hashedAccount }) => {
  const { Moralis } = useMoralis();

  const [disableBtn, setDisableBtn] = useState(false);
  const [disableLowBal, setDisableLowBal] = useState(true);

  useEffect(() => {
    if (available > 1) {
      setDisableLowBal(false);
    }
  }, [available]);

  const withdrawTrax = async () => {
    if (hashedAccount && available) {
      setDisableBtn(true);
      let amount = Number(available);

      // b calculation
      let hexClaimVal = (amount * 10 ** 18).toString(16);
      hexClaimVal = `${hexClaimVal}`;
      if (hexClaimVal.length % 2 !== 0) {
        hexClaimVal = "0x0" + hexClaimVal;
      } else {
        hexClaimVal = "0x" + hexClaimVal;
      }

      let options = {
        chain: CONFIG.chainID,
        contractAddress: CONFIG.smart_contract_moosetrax,
        functionName: "claimReward",
        abi: FULLABI,
        params: {
          _hash: hashedAccount,
          b: hexClaimVal,
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
    }
  };

  return (
    <div className="trax-bg">
      <div>
        <h1 className="text-7xl text-white font-semibold text-center">
          Island Bank Balance
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
              <p className="text-5xl font-semibold text-white">
                <CountUp end={Math.floor(perDayTrax)} />
              </p>
            </div>
            <p className="text-center">TRAX Earned Per Day Trax</p>
          </div>

          <div className="separator">
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">
                <DecimalCounter value={available} />
              </p>
            </div>
            <p className=" text-center">Total TRAX Owned</p>
            <div className="flex justify-center">
              <button
                disabled={disableBtn || disableLowBal}
                onClick={withdrawTrax}
                className="dashboard px-10 py-5 font-semibold "
              >
                WITHDRAW TRAX
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">
                <DecimalCounter value={ownedTrax} />
              </p>
            </div>
            <p className=" text-center">Total TRAX Owned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trax;
