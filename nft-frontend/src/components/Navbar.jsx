import React from "react";
import logo from "../assets/NftLogo.png";
import walletIcon from "../assets/walletIcon.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

//Created a Custom connect Button to match the design
const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openAccountModal,
        openChainModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <>
            {!connected ? (
              // Custom Connect Button
              <button
                onClick={openConnectModal}
                className="animate-bounce flex items-center text-white text-sm bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-4 py-2 rounded-[30px] cursor-pointer"
              >
                <img src={walletIcon} alt="wallet Icon" />
                Connect Wallet
              </button>
            ) : (
              <div className="flex gap-4 items-center">
                {/* Chain Button */}
                <button
                  onClick={openChainModal}
                  className="flex items-center text-white text-sm bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-4 py-2 rounded-[30px]"
                >
                  {chain.hasIcon && (
                    <img
                      src={chain.iconUrl}
                      alt={chain.name}
                      className="w-5 h-5 inline-block mr-2"
                    />
                  )}
                  {chain.name}
                </button>

                {/* Account Button */}
                <button
                  onClick={openAccountModal}
                  className="flex items-center text-white text-sm bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-4 py-2 rounded-[30px]"
                >
                  {account.displayName}
                </button>
              </div>
            )}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

const Navbar = () => {
  return (
    <>
      <header className="bg-[#000000] w-full h-[73px]">
        <nav className="w-4/5 mx-auto flex justify-between items-center h-full">
          <div className="flex jsutify-center items-center text-white text-2xl font-bold">
            <img src={logo} alt="Logo" />
            NFT MINT
          </div>
          {/* <button className="flex items-center text-white text-sm bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-4 py-2 rounded-[30px]">
            <img src={walletIcon} alt="wallet Icon" /> <p>Connect Wallet</p>
          </button> */}
          <CustomConnectButton />
        </nav>
      </header>
    </>
  );
};

export default Navbar;
