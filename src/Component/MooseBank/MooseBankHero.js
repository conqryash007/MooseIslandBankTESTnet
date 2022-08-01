import React from "react";
import "./MooseBankHero.css";
import Countdown from "react-countdown";

import { useMoralis } from "react-moralis";
import { FULLABI } from "./FULLABI";
import { CONFIG } from "./../../config";

import { notifyError, notifyInfo, notifySuccess } from "./ToastFunction";
import { ToastContainer } from "react-toastify";

const MooseBankHero = ({
  oneTimeClaimValue,
  hashedAccount,
  paramClaim,
  hasClaimed,
  bonus,
  burnedTrax,
  setHasClaimed,
  allDataLoaded,
  available,
}) => {
  const { Moralis } = useMoralis();

  const claimBonusTrax = async () => {
    if (allDataLoaded && hashedAccount) {
      let hexClaimVal = Number(paramClaim * 10 ** 18).toString(16);
      hexClaimVal = `${hexClaimVal}`;
      if (hexClaimVal.length % 2 !== 0) {
        hexClaimVal = "0x0" + hexClaimVal;
      } else {
        hexClaimVal = "0x" + hexClaimVal;
      }

      console.log(paramClaim, hexClaimVal);

      let options = {
        abi: FULLABI,
        functionName: "oneTimeClaim",
        chain: CONFIG.chainID,
        params: {
          _hash: hashedAccount,
          b: hexClaimVal,
        },
        contractAddress: CONFIG.smart_contract_moosetrax,
      };

      try {
        notifyInfo("Your transaction has started");
        const mintTransaction = await Moralis.executeFunction(options);
        console.log(
          "mintTransaction : ",
          mintTransaction,
          "mintTransactionhash : ",
          mintTransaction.hash
        );
        // toastify #1
        notifyInfo("Please wait for confirmation");

        await mintTransaction.wait();

        // toastify #2
        notifySuccess("Successfully Claimed Bonus Trax");
        setHasClaimed(true);
        window.location.reload();
      } catch (err) {
        console.log("mintError=>", err);
        console.log("bankhero -----");

        if (err?.message?.includes("Claiming reward has been paused")) {
          notifyError("Claiming reward is Paused at the moment");
        } else if (err?.message?.includes("Already Claimed")) {
          notifyError("You have already claimed your bonus Trax");
        } else {
          // toastify #3
          notifyError("There is some error Please Try Again Later");
        }
      }
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    // Render a countdown
    return (
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-4 mb-10 gap-x-3 w-9/12">
          <div className=" DateCountDown">
            <span className="text-5xl lg:text-7xl">{days}</span>
            <p>Days</p>
          </div>
          <div className="DateCountDown">
            <span className="text-5xl lg:text-7xl">{hours}</span>
            <p>Hours</p>
          </div>
          <div className="DateCountDown">
            <span className="text-5xl lg:text-7xl">{minutes}</span>
            <p>Minutes</p>
          </div>
          <div className="DateCountDown">
            <span className="text-5xl lg:text-7xl">{seconds}</span>
            <p>Seconds</p>
          </div>
        </div>
      </div>
    );
  };

  const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  return (
    <div className=" lg:px-32">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        pauseOnHover
      />
      {hasClaimed ? (
        <></>
      ) : (
        <div>
          <div className="flex justify-center">
            <div>
              <h1 className="text-5xl font-bold py-5 lg:text-8xl text-white text-center header-font-common">
                Bonus Trax
              </h1>
              <h1 className="text-3xl font-bold py-5 lg:text-4xl text-white text-center header-font-common">
                Claim Your Bonus Tokens Before The Timer Runs Out!
              </h1>
              <Countdown
                autoStart={true}
                controlled={false}
                date={1667314595000}
                daysInHours={false}
                precision={0}
                zeroPadDays={3}
                zeroPadTime={2}
                renderer={renderer}
              />
            </div>
          </div>
          <p className="text-center mt-5 mb-5 text-lg heroparagraph para-text claim-text">
            Below you will see your bonus TRAX tokens along with TRAX tokens you
            have accumulated so far. When you claim your bonus TRAX, you will be
            claiming ALL the TRAX tokens you have available on the server. Once
            you claim, your available balance will go to zero and you will be
            starting fresh.
          </p>
          <div className="flex justify-center mt-10 mb-20 ">
            <div
              style={{ alignItems: "center" }}
              className="grid  p-5 lg:grid-cols-3  w-11/12 gap-y-5 common-box"
            >
              <div>
                <div className="flex justify-center">
                  <p className="text-5xl font-semibold text-white">
                    {numberWithCommas(Math.floor(bonus))}
                  </p>
                </div>
                <p className="text-center semi-text"> Bonus Trax</p>
              </div>

              <div>
                <div className="flex justify-center ">
                  <p className="text-5xl font-semibold text-white ">
                    {numberWithCommas(available.toFixed(2))}
                  </p>
                </div>
                <p className=" text-center semi-text">TRAX Tokens Earned</p>
              </div>

              <div className="flex flex-col justify-center separator ">
                <div>
                  <div className="flex justify-center ">
                    <p className="text-5xl font-semibold text-white ">
                      {numberWithCommas(oneTimeClaimValue)}
                    </p>
                  </div>
                  <p className=" text-center semi-text">
                    TOTAL CLAIMABLE AMOUNT
                  </p>
                </div>
                <button
                  disabled={hasClaimed}
                  onClick={claimBonusTrax}
                  className="dashboard px-4 py-3 font-semibold claim-btn"
                >
                  CLAIM BONUS TRAX
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MooseBankHero;
