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
          // ---------CLAIMABLE COUNT---------
          // ---------------------------------
          const url = `https://trax-etherscan-api.herokuapp.com/api/${account}`;
          const response = await axios.get(url);

          const finalResponse = Math.floor(response.data.finalTotalTrax);

          setTotalTraxClaim(finalResponse);

          // ---------CLAIMED TRAX COUNT------
          // ---------------------------------
          const res = await myContract.methods.rewards(account).call();
          const finalRes = Number(web3.utils.fromWei(res));

          setAlreadyClaimed(finalRes);
          setAvailableClaim(finalResponse - finalRes);
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
          const val = parseInt(message._hex, 16) / Math.pow(10, 18);
          setOwnedTrax(val);
        }
      } catch (err) {
        console.log("APP -----");
        console.log(err);
      }
    };

    run();
  }, [account]);

  console.log(ownedTrax, availableClaim, perDayTrax);

  return (
    <div>
      <Header></Header>
      <MooseBankHero></MooseBankHero>
      <Trax
        ownedTrax={ownedTrax}
        available={availableClaim}
        perDayTrax={perDayTrax}
      ></Trax>
      <TraxPrax></TraxPrax>
      <Footer></Footer>
    </div>
  );
}

export default App;
