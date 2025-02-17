import logo from "../assets/NftLogo.png";
import walletIcon from "../assets/walletIcon.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
                className="animate-bounce flex items-center gap-2 text-white text-sm sm:text-base bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[30px] cursor-pointer"
              >
                <img src={walletIcon} alt="wallet Icon" className="w-4 h-4 sm:w-5 sm:h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                {/* Chain Button */}
                <button
                  onClick={openChainModal}
                  className="flex items-center gap-2 text-white text-sm sm:text-base bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[30px]"
                >
                  {chain.hasIcon && (
                    <img
                      src={chain.iconUrl}
                      alt={chain.name}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  )}
                  {chain.name}
                </button>

                {/* Account Button */}
                <button
                  onClick={openAccountModal}
                  className="flex items-center text-white text-sm sm:text-base bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[30px]"
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
    <header className="bg-[#000000] w-full h-[65px] sm:h-[73px] px-4 sm:px-0">
      <nav className="w-full sm:w-4/5 mx-auto flex justify-between items-center h-full">
        <div className="flex items-center text-white text-lg sm:text-2xl font-bold gap-2">
          <img src={logo} alt="Logo" className="w-6 sm:w-auto" />
          NFT MINT
        </div>
        <CustomConnectButton />
      </nav>
    </header>
  );
};

export default Navbar;
