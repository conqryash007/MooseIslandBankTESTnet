import React, { useState, useEffect } from "react";

import Footer from "./Component/Footer/Footer";
import MooseBankHero from "./Component/MooseBank/MooseBankHero";
import Header from "./Component/Header/Header";
import Trax from "./Component/MooseBank/Trax";
import TraxPrax from "./Component/MooseBank/TraxPrax";

//
import Web3 from "web3/dist/web3.min.js";
import { useMoralis } from "react-moralis";
import { FULLABI } from "./Component/MooseBank/FULLABI";
import { CONFIG } from "./config";
import axios from "axios";

function App() {
  const [perDayTrax, setPerDayTrax] = useState(0);
  const [, setTotalTraxClaim] = useState(0);
  const [, setAlreadyClaimed] = useState(0);
  const [availableClaim, setAvailableClaim] = useState(0);
  const [ownedTrax, setOwnedTrax] = useState(0);
  const [oneTimeClaim, setOneTimeClaim] = useState(0);
  const [accountHash, setAccountHash] = useState(null);
  const [claim, setHasClaimed] = useState(false);

  const { Moralis, account } = useMoralis();

  useEffect(() => {
    const run = async () => {
      try {
        await Moralis.enableWeb3();
        let web3 = new Web3(Moralis.provider);
        let myContract = new web3.eth.Contract(
          FULLABI,
          CONFIG.smart_contract_moosetrax
        );

        // ---------MINIMOOSE COUNT---------
        // ---------------------------------
        const optionsMinimoose = {
          chain: CONFIG.chainID,
          address: account,
          token_address: CONFIG.smart_contract_minimoose,
        };

        const miniMooseNFT = await Moralis.Web3API.account.getNFTsForContract(
          optionsMinimoose
        );

        // -----------OGMOOSE COUNT---------
        // ---------------------------------
        const optionsOgMoose = {
          chain: CONFIG.chainID,
          address: account,
          token_address: CONFIG.smart_contract_erc721,
        };

        const ogMooseNFT = await Moralis.Web3API.account.getNFTsForContract(
          optionsOgMoose
        );

        const countMini = miniMooseNFT.result.length;
        const countOg = ogMooseNFT.result.length;

        // ---------TRAX REWARD COUNT-------
        // ---------------------------------
        const traxRewardPerDay = countMini * 15 + countOg * 10;
        setPerDayTrax(traxRewardPerDay);

        if (account) {
          // ---------HAS CLAIMED-------------
          // ---------------------------------
          const hasClaimed = await myContract.methods
            .hasClaimed(account)
            .call();
          setHasClaimed(hasClaimed);

          // ---------CLAIMABLE COUNT---------
          // ---------------------------------
          const url = `https://trax-etherscan-api.herokuapp.com/api/${account}`;
          const response = await axios.get(url);

          const finalResponse = Number(response.data.finalTotalTrax);

          setTotalTraxClaim(finalResponse);

          // ---------CLAIMED TRAX COUNT------
          // ---------------------------------
          const res = await myContract.methods.rewards(account).call();
          const finalRes = Number(web3.utils.fromWei(res));

          // ---------ONE TIME CLAIMED TRAX COUNT------
          // ------------------------------------------
          const optionBonus = {
            abi: FULLABI,
            functionName: "oneTimeClaimAmount",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_moosetrax,
            params: {
              account: account,
            },
          };

          const bonusVal = await Moralis.executeFunction(optionBonus);
          const val = Number(Number(parseInt(bonusVal._hex, 16)).toFixed(2));

          // rounding off one time claim

          const oneTime = Number(
            Number(val + Number(finalResponse - finalRes))
          ).toFixed(2);

          setOneTimeClaim(oneTime);
          setAlreadyClaimed(finalRes);
          setAvailableClaim(finalResponse - finalRes);
        }

        if (account) {
          const hash = web3.utils.soliditySha3(account);
          setAccountHash(hash);
        }

        // ---------TRAX OWNED--------------
        // ---------------------------------
        if (account) {
          const optionTraxOwned = {
            abi: FULLABI,
            functionName: "balanceOf",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_moosetrax,
            params: {
              account: account,
            },
          };

          const message = await Moralis.executeFunction(optionTraxOwned);
          const val = Number(
            parseInt(message._hex, 16) / Math.pow(10, 18)
          ).toFixed(2);
          setOwnedTrax(val);
        }
      } catch (err) {
        console.log("APP -----");
        console.log(err);
      }
    };

    run();
  }, [account]);

  console.log(ownedTrax, availableClaim, perDayTrax, oneTimeClaim);

  return (
    <div>
      <Header></Header>
      <MooseBankHero
        oneTimeClaimValue={oneTimeClaim}
        hashedAccount={accountHash}
        paramClaim={availableClaim}
        hasClaimed={claim}
      ></MooseBankHero>
      <Trax
        ownedTrax={ownedTrax}
        available={availableClaim}
        hashedAccount={accountHash}
        perDayTrax={perDayTrax}
      ></Trax>
      <TraxPrax></TraxPrax>
      <Footer></Footer>
    </div>
  );
}

export default App;
