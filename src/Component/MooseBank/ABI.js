const ABI = {
  oneTimeClaim: [
    {
      inputs: [],
      name: "oneTimeClaim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  buyTraxPax: [
    {
      inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
      name: "buyTraxPax",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
  claimReward: [
    {
      inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
      name: "claimReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  balanceOf: [
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ],
  rewards: [
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "rewards",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ],
};

export { ABI };
