import React, { useState, useEffect } from "react";

import Footer from "./Component/Footer/Footer";
import MooseBankHero from "./Component/MooseBank/MooseBankHero";
import Header from "./Component/Header/Header";
import Trax from "./Component/MooseBank/Trax";
import TraxPrax from "./Component/MooseBank/TraxPrax";
import {
  abiOG,
  abiMini,
  abiGetBurnedTrax,
  // abiTotalGetBurnedSB,
  SHMMABI,
} from "./getSuppyABI";
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
  const [bonus, setBonus] = useState(0);
  const [pricesPrax, setPricesPrax] = useState([]);
  const [burnedTrax, setBurnedTrax] = useState(0);
  const [totalBurnedTraxSB, setTotalBurnedTraxSB] = useState(0);
  const [availableToMint, setAvailableToMint] = useState(10000000000);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

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
        if (account) {
          const optionMiniMoose = {
            abi: abiMini,
            functionName: "balanceOf",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_minimoose,
            params: {
              owner: account,
            },
          };

          const miniMooseBalance = await Moralis.executeFunction(
            optionMiniMoose
          );
          const countMini = Number(Number(parseInt(miniMooseBalance._hex, 16)));

          // -----------OGMOOSE COUNT---------
          // ---------------------------------
          const optionOgMoose = {
            abi: abiOG,
            functionName: "balanceOf",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_erc721,
            params: {
              owner: account,
            },
          };

          const ogMooseBalance = await Moralis.executeFunction(optionOgMoose);
          const countOg = Number(Number(parseInt(ogMooseBalance._hex, 16)));

          // -----------different heros COUNT---------
          // -----------------------------------------
          const total = {
            abi: SHMMABI,
            functionName: "balanceOf",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
            params: {
              owner: account,
            },
          };
          const t = await Moralis.executeFunction(total);
          const imax = parseInt(t._hex);

          const optionHeroMoose = {
            abi: SHMMABI,
            functionName: "tokenOfOwnerByIndex",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
            params: {
              owner: account,
              index: 0,
            },
          };

          const promises = [];

          for (let i = 0; i < imax; i++) {
            optionHeroMoose.params.index = i;
            promises.push(Moralis.executeFunction(optionHeroMoose));
          }

          let res = await Promise.all(promises);
          res = res.map((curr) => parseInt(curr._hex));

          const inc = [
            627, 640, 679, 688, 705, 740, 750, 800, 819, 840, 880, 900, 921,
            940, 979, 986, 1000, 1025, 1050, 1100, 1125, 1150, 1177, 1234, 1250,
          ];

          let cEpic = 0,
            cUltra = 0,
            cLegen = 0;
          res.forEach((curr) => {
            if (Number(curr) < 626) {
              cEpic += 1;
            } else if (inc.includes(Number(curr) + 1)) {
              cUltra += 1;
            } else {
              cLegen += 1;
            }
          });

          // ---------TRAX REWARD COUNT-------
          // ---------------------------------
          const traxRewardPerDay =
            countMini * 15 +
            countOg * 10 +
            cEpic * 50 +
            cUltra * 150 +
            cLegen * 100;
          setPerDayTrax(traxRewardPerDay);
        }

        if (account) {
          // ---------HAS CLAIMED-------------
          // ---------------------------------
          const hasClaimed = await myContract.methods
            .hasClaimed(account)
            .call();
          setHasClaimed(hasClaimed);

          // ---------CLAIMABLE COUNT---------
          // ---------------------------------
          const url = `https://moose-backend-new-production.up.railway.app/islandbank/api/${account}`;
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

          setBonus(val);
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

        // ---------PRICES OF --------------
        // -----------PAXS------------------
        if (account) {
          const optionPricesPrax = {
            abi: FULLABI,
            functionName: "getTraxPaxPrice",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_moosetrax,
          };

          const pricesBN = await Moralis.executeFunction(optionPricesPrax);
          const pricesETH = pricesBN.map((curr) => {
            return Number(web3.utils.fromWei(curr.toString()));
          });

          setPricesPrax(pricesETH);
        }

        // ---------TRAX BURNED---------------
        // -----------BY USER------------------
        if (account) {
          let _myContract = new web3.eth.Contract(
            abiGetBurnedTrax,
            CONFIG.smart_contract_heroboxserum
          );

          const traxBurnedRes = await _myContract.methods
            .traxBurned(account)
            .call();

          setBurnedTrax(traxBurnedRes);
        }

        // ------TOTAL TRAX BURNED---------------
        // -----------USING HEROBOX AND SERUM COUNT------------------
        if (account) {
          const optionHB = {
            abi: SHMMABI,
            functionName: "totalHeoBoxBurned",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
          };
          const optionS1 = {
            abi: SHMMABI,
            functionName: "totalSerumX1Burned",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
          };
          const optionS2 = {
            abi: SHMMABI,
            functionName: "totalSerumX2Burned",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
          };
          const optionS3 = {
            abi: SHMMABI,
            functionName: "totalSerumX3Burned",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
          };
          const optionS4 = {
            abi: SHMMABI,
            functionName: "totaltraxBurned",
            chain: CONFIG.chainID,
            contractAddress: CONFIG.smart_contract_superHeroMutantMoose,
          };

          const c0 = await Moralis.executeFunction(optionHB);
          const c1 = await Moralis.executeFunction(optionS1);
          const c2 = await Moralis.executeFunction(optionS2);
          const c3 = await Moralis.executeFunction(optionS3);
          const c4z = await Moralis.executeFunction(optionS4);

          const c4 = web3.utils.fromWei(c4z._hex);

          const burned =
            c0 * 50000 + c1 * 100000 + c2 * 250000 + c3 * 500000 + Number(c4);

          setTotalBurnedTraxSB(burned);
        }

        if (account) {
          // -------------------------------
          // --- TOTAL AVAILABLE TO MINT ---

          const resCap = await myContract.methods.cap().call();
          const finalCap = web3.utils.fromWei(resCap);

          const _totalSupply = await myContract.methods.totalSupply().call();
          const totalSupply = web3.utils.fromWei(_totalSupply);

          console.log((finalCap - totalSupply).toFixed(2));

          setAvailableToMint((finalCap - totalSupply).toFixed(2));

          setAllDataLoaded(true);
        }
      } catch (err) {
        console.log("APP -----");
        console.log(err);
      }
    };

    run();
  }, [account]);

  console.log(ownedTrax, availableClaim, perDayTrax, oneTimeClaim, bonus);

  return (
    <div>
      <Header></Header>
      <MooseBankHero
        oneTimeClaimValue={oneTimeClaim}
        hashedAccount={accountHash}
        paramClaim={availableClaim}
        hasClaimed={claim}
        setHasClaimed={setHasClaimed}
        bonus={bonus}
        burnedTrax={burnedTrax}
        allDataLoaded={allDataLoaded}
        available={availableClaim}
      ></MooseBankHero>
      <Trax
        ownedTrax={ownedTrax}
        available={availableClaim}
        hashedAccount={accountHash}
        perDayTrax={perDayTrax}
        burnedTrax={burnedTrax}
        hasClaimed={claim}
        availableToMint={availableToMint}
        totalBurnedSB={totalBurnedTraxSB}
      ></Trax>
      <TraxPrax
        pricesPrax={pricesPrax}
        availableToMint={availableToMint}
      ></TraxPrax>
      <Footer></Footer>
    </div>
  );
}

export default App;
