import * as React from "react";
import { connectWallet, disconnectWallet } from "../utility/commonFun";
const Navbar = () => {

  const [walletAddress, setWalletAddress] = React.useState("");

  const onClickConnectWallet = async () => {
    const walletResponse = await connectWallet();
    setWalletAddress(walletResponse.address);
    // console.log("walletResponse.address", walletResponse.address);
  };

  const onClickDisconnectWallet = async () => {
    disconnectWallet()
    setWalletAddress("");
  };
  return (
    <div className="navbar navbar-expand-sm navbar-dark bg-black">
      {/* <a className="navbar-brand" href="#">
                <img src={LogoIcon} alt="Logo" className="logo-img" />
            </a> */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          {
            walletAddress === "" ?
              <button title={walletAddress} onClick={onClickConnectWallet} type="button" className="btn btn-primary">
                CONNECT
              </button> :
              <button title={walletAddress} onClick={onClickDisconnectWallet} type="button" className="btn btn-danger">
                DISCONNECT
              </button>
          }
        </li>
      </ul>
    </div>
  );
};

export default Navbar;