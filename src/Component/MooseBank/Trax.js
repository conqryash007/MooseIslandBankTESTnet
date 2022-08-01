import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

import DecimalCounter from "./DecimalCounter";

import "./Trax.css";
//
import { useMoralis } from "react-moralis";
import { FULLABI } from "./FULLABI";
import { CONFIG } from "./../../config";
//
import { notifyError, notifyInfo, notifySuccess } from "./ToastFunction";

const Trax = ({
  ownedTrax,
  available,
  perDayTrax,
  hashedAccount,
  burnedTrax,
  hasClaimed,
  availableToMint,
}) => {
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

        window.location.reload();
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

  const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <div className="trax-bg">
      <div>
        <h1 className="text-7xl underline text-white font-semibold text-center main-text-bal">
          ISLAND BANK BALANCE
        </h1>
      </div>
      <div className="new-main-container-1">
        <div className="new-sub-container">
          <div className="separator separator-cont">
            <button
              disabled={true}
              className="dashboard px-10 py-5 font-semibold btn-style-sub"
            >
              TOTAL TRAX
            </button>
          </div>
          <div className="text-5xl pt-2 font-semibold text-white number-common-mob ">
            {numberWithCommas(10000000000)}
          </div>
        </div>
        <div className="new-sub-container">
          <div className="separator separator-cont">
            <button
              disabled={true}
              className="dashboard px-10 py-5 font-semibold btn-style-sub"
            >
              AVAILABLE
            </button>
          </div>
          <div className="text-5xl pt-2 number-common-mob font-semibold text-white">
            {numberWithCommas(availableToMint)}
          </div>
        </div>
        <div className="new-sub-container bottom-border">
          <div className="separator separator-cont">
            <button
              disabled={true}
              className="dashboard px-10 py-5 font-semibold btn-style-sub"
            >
              MINTED
            </button>
          </div>
          <div className="text-5xl pt-2 number-common-mob font-semibold text-white">
            {numberWithCommas((10000000000 - availableToMint).toFixed(2))}
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-7xl underline text-white font-semibold text-center main-text-bal pt-10">
          PERSONAL TRAX BALANCE
        </h1>
        <div className="new-main-container-1">
          <div className="new-sub-container cont-2">
            <div className="separator separator-cont">
              <button
                disabled={true}
                className="dashboard px-10 py-5 font-semibold btn-style-sub"
              >
                TRAX OWNED IN WALLET
              </button>
            </div>
            <div className="text-5xl pt-2 font-semibold text-white number-common-mob ">
              {numberWithCommas(ownedTrax)}
            </div>
          </div>
          <div className="new-sub-container cont-2">
            <div className="separator separator-cont">
              <button
                disabled={disableBtn || disableLowBal}
                onClick={withdrawTrax}
                className="dashboard px-10 py-5 font-semibold btn-style-sub"
              >
                WITHDRAW TRAX TOKENS
              </button>
            </div>
            <div className="text-5xl pt-2 number-common-mob font-semibold text-white">
              {numberWithCommas(available.toFixed(2))}
            </div>
          </div>
          <div className="new-sub-container cont-2 bottom-border">
            <div className="separator separator-cont">
              <button
                disabled={true}
                className="dashboard px-10 py-5 font-semibold btn-style-sub"
              >
                TRAX EARNED PER DAY
              </button>
            </div>
            <div className="text-5xl pt-2 number-common-mob font-semibold text-white">
              {numberWithCommas(Math.floor(perDayTrax))}
            </div>
          </div>
        </div>
      </div>
      {/* {hasClaimed ? (
        <div className="flex justify-center mt-10 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-3  w-9/12 gap-y-10">
            <div>
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">
                  <CountUp end={10} />B
                </p>
              </div>
              <p className="text-center semi-text">Total Supply Of Trax</p>
            </div>

            <div className="separator separator-cont ">
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">
                  {availableToMint / 1000000 > 1 ? (
                    <>
                      <p style={{ display: "flex" }}>
                        <CountUp end={availableToMint / 1000000} />
                        <span className="pl-1">{" M"}</span>
                      </p>
                    </>
                  ) : (
                    <DecimalCounter value={availableToMint} />
                  )}
                </p>
              </div>
              <p className=" text-center semi-text">TRAX Available To Mint</p>
            </div>
            <div>
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">
                  <DecimalCounter value={burnedTrax} />
                </p>
              </div>
              <p className=" text-center semi-text">TRAX Burned</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-center mt-10 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-3  w-9/12 gap-y-10">
          <div>
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">
                <CountUp end={Math.floor(perDayTrax)} />
              </p>
            </div>
            <p className="text-center semi-text">TRAX Earned Per Day Trax</p>
          </div>

          <div className="separator separator-cont">
            <div className="flex justify-center">
              <p className="text-5xl font-semibold text-white">
                <DecimalCounter value={available} />
              </p>
            </div>
            <p className=" text-center semi-text">Available To Claim</p>
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
            <p className=" text-center semi-text">Total TRAX Owned</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Trax;
