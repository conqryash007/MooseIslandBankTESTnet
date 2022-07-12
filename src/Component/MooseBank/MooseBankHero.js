import React from "react";
import "./MooseBankHero.css";
import Countdown from "react-countdown";
import CountUp from "react-countup";

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
}) => {
  const { Moralis } = useMoralis();

  const claimBonusTrax = async () => {
    if (paramClaim && hashedAccount) {
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
      <div>
        <div className="flex justify-center">
          <div>
            <h1 className="text-2xl font-bold py-5 lg:text-4xl text-white text-center">
              Claim Your Bonus Tokens Before The Timer Runs Out!
            </h1>
            <Countdown
              autoStart={true}
              controlled={false}
              date={1658847195000}
              daysInHours={false}
              precision={0}
              zeroPadDays={3}
              zeroPadTime={2}
              renderer={renderer}
            />
          </div>
        </div>
        <div className="flex justify-center mt-10 mb-20">
          <div className="grid lg:grid-cols-4  w-11/12 gap-y-5">
            <div>
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">
                  <CountUp end={Math.floor(bonus)} />
                </p>
              </div>
              <p className="text-center">Total Bonus Trax</p>
            </div>

            <div>
              <div className="flex justify-center ">
                {hasClaimed ? (
                  <>
                    <p className="text-5xl font-semibold text-white ">
                      CLAIMED
                    </p>
                  </>
                ) : (
                  <p className="text-5xl font-semibold text-white ">
                    <CountUp end={Math.floor(oneTimeClaimValue)} />.
                    {(oneTimeClaimValue - Math.floor(oneTimeClaimValue)) * 100 >
                      0 &&
                    (oneTimeClaimValue - Math.floor(oneTimeClaimValue)) * 100 <
                      10 ? (
                      `0${Math.floor(
                        (oneTimeClaimValue - Math.floor(oneTimeClaimValue)) *
                          100
                      )}`
                    ) : (
                      <CountUp
                        end={
                          (oneTimeClaimValue - Math.floor(oneTimeClaimValue)) *
                          100
                        }
                      />
                    )}
                  </p>
                )}
              </div>
              <p className=" text-center">TRAX Tokens Earned</p>
            </div>
            <div>
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">
                  <CountUp end={burnedTrax} />
                </p>
              </div>
              <p className=" text-center">TRAX Tokens Burned</p>
            </div>

            <div className="flex justify-center separator ">
              <button
                disabled={hasClaimed}
                onClick={claimBonusTrax}
                className="dashboard px-4 py-3 font-semibold "
              >
                CLAIM BONUS TRAX
              </button>
            </div>
          </div>
        </div>
        <p className="text-center mt-5 mb-5 text-lg heroparagraph">
          You are allowed to claim your bonus $TRAX Tokens once per wallet. The
          calculations are based on how many moose you hold and how long your
          have had them. Each claim will be different. There are NO set amounts.
        </p>
      </div>
    </div>
  );
};

export default MooseBankHero;
