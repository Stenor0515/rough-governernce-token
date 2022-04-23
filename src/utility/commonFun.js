import { ethers } from "ethers";
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  // Example with WalletConnect provider
  walletconnect: {
    cacheProvider: false,
    package: WalletConnectProvider,
    options: {
      infuraId: "9aa3d95b3bc440fa88ea12eaa4456161" // required
    }
  }
};


const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions
});
export const getContract = async (contractAddress, contractABI) => {
  const instance = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = await provider.getSigner();
  const address = await signer.getAddress()

  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return {contract, address};
};

export const disconnectWallet = async () => {
  try {
    return await web3Modal.clearCachedProvider();
  } catch (e) {
    console.error(e);
    return false;
  }
}
export const connectWallet = async () => {
  // const chainId = process.env.REACT_APP_chainId;
  const chainId = "0x61"
  console.log(chainId)
  try {
    await web3Modal.connect();
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    if (chain === chainId) {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Your wallet is connected to the site.",
        };
      } else {
        return {
          address: "",
          status: "😥 Connect your wallet account to the site.",
        };
      }
    } else {
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      return {
        address: "",
        status: "😥 Connect your wallet account to the site.",
      };
    }
  } catch (err) {
    return {
      address: "",
      status: "😥 " + err.message,
    };
  }
};