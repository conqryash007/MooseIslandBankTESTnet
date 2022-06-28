import React from "react";
import "./MooseBankHero.css";
import Countdown from "react-countdown";

const MooseBankHero = () => {
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
      <div>
        <div className="flex justify-center">
          <div>
            <h1 className="text-2xl font-bold lg:text-5xl text-white text-center">
              Claim Your Bonus Tokens Before The Timer Runs Out!
            </h1>
            <p className="text-center mt-5 mb-5 text-lg heroparagraph">
              You can claim the bonus TRAX Once Per Holder Per Wallet. We know
              some of you have multiple wallets and that is okay. So you are
              allowed to claim once per wallet. The amount you get will be based
              upon how long you have held them. Everyone's bonus will be
              different depending on how many moose you have in that particular
              wallet. Once the timer runs down, these tokens will be gone and
              will NOT be able to be claimed again.
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-10 mb-20">
          <div className="grid lg:grid-cols-3  w-9/12 gap-y-5">
            <div>
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">10,000,000</p>
              </div>
              <p className="text-center">Total Bonus Trax</p>
            </div>

            <div className="flex justify-center separator ">
              <button className="dashboard px-4 py-3 font-semibold ">
                CLAIM BONUS TRAX
              </button>
            </div>
            <div>
              <div className="flex justify-center">
                <p className="text-5xl font-semibold text-white">42,543</p>
              </div>
              <p className=" text-center">TRAX Tokens Burned</p>
            </div>
          </div>
        </div>
        <Countdown
          autoStart={true}
          controlled={false}
          date={1658242332000}
          daysInHours={false}
          precision={0}
          zeroPadDays={3}
          zeroPadTime={2}
          renderer={renderer}
        />
      </div>
    </div>
  );
};

export default MooseBankHero;
