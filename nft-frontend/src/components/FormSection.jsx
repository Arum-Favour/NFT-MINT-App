import { useState, useEffect, useMemo } from "react";
import MintIcon from "../assets/MintIcon.png";
import CheckIcon from "../assets/CheckIcon.png";
import ShareIcon from "../assets/ShareIcon.png";
import { useAccount, useWriteContract } from "wagmi";
import { useWaitForTransactionReceipt } from "wagmi";
import { createPublicClient, http } from "viem";
import { sepolia } from "wagmi/chains";

const contractAddress = "0x528086839cF63c6215C3dE2C14C8893378e106BA";
import contractAbi from "../contractAbi.json";

const resolveIpfs = (uri) => {
  if (!uri) return uri;
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return uri;
};

const MAX_ITEMS = 10; // display first 10 predefined NFTs

const FormSection = () => {
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const [items, setItems] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [minting, setMinting] = useState(false);
  const [txSuccessInfo, setTxSuccessInfo] = useState(null);

  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain: sepolia,
        transport: http(import.meta.env.VITE_MY_RPC_URL),
      }),
    []
  );

  const { isLoading, isSuccess: isTxnSuccess, isError } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    const loadCatalog = async () => {
      setIsLoadingCatalog(true);
      try {
        const nextItems = [];
        for (let id = 1; id <= MAX_ITEMS; id += 1) {
          // fetch tokenURI metadata
          let tokenUri;
          try {
            tokenUri = await publicClient.readContract({ 
              address: contractAddress,
              abi: contractAbi.abi || contractAbi,
              functionName: "tokenURI",
              args: [BigInt(id)],
            });
          } catch {
            // ignore tokenURI read failure
            tokenUri = null;
          }

          let metadata = null;
          if (tokenUri) {
            const httpUri = resolveIpfs(String(tokenUri));
            try {
              const res = await fetch(httpUri);
              if (res.ok) metadata = await res.json();
            } catch {
              // ignore metadata fetch failure
            }
          }

          // availability via ownerOf
          let available = true;
          try {
            await publicClient.readContract({
              address: contractAddress,
              abi: contractAbi.abi || contractAbi,
              functionName: "ownerOf",
              args: [BigInt(id)],
            });
            available = false; // owner exists
          } catch {
            available = true; // likely not minted yet
          }

          nextItems.push({
            id,
            name: metadata?.name || `NFT #${id}`,
            description: metadata?.description || "",
            image: resolveIpfs(metadata?.image),
            available,
          });
        }
        setItems(nextItems);
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    loadCatalog();
  }, [publicClient]);

  useEffect(() => {
    if (isTxnSuccess) {
      setMinting(false);
      setTxSuccessInfo({ hash });
      // refresh catalog to reflect new availability
      // re-run loader
      (async () => {
        try {
          const nextItems = [];
          for (let id = 1; id <= MAX_ITEMS; id += 1) {
            let tokenUri;
            try {
              tokenUri = await publicClient.readContract({
                address: contractAddress,
                abi: contractAbi.abi || contractAbi,
                functionName: "tokenURI",
                args: [BigInt(id)],
              });
            } catch {
              tokenUri = null;
            }

            let metadata = null;
            if (tokenUri) {
              const httpUri = resolveIpfs(String(tokenUri));
              try {
                const res = await fetch(httpUri);
                if (res.ok) metadata = await res.json();
              } catch {
                // ignore
              }
            }

            let available = true;
            try {
              await publicClient.readContract({
                address: contractAddress,
                abi: contractAbi.abi || contractAbi,
                functionName: "ownerOf",
                args: [BigInt(id)],
              });
              available = false;
            } catch {
              available = true;
            }

            nextItems.push({
              id,
              name: metadata?.name || `NFT #${id}`,
              description: metadata?.description || "",
              image: resolveIpfs(metadata?.image),
              available,
            });
          }
          setItems(nextItems);
        } catch {
          // ignore refresh errors
        }
      })();
    }
    if (isError) {
      setMinting(false);
    }
  }, [isTxnSuccess, isError, hash, publicClient]);

  const handleMint = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      setMinting(true);
      await writeContract({
        address: contractAddress,
        abi: contractAbi.abi || contractAbi,
        functionName: "safeMint",
        args: [address],
      });
    } catch (error) {
      console.error("Mint failed:", error);
      alert("Minting failed. Please try again.");
      setMinting(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full sm:w-4/5 mx-auto mt-10 sm:mt-20 h-auto px-4">
      <div className="flex flex-col justify-center w-full bg-[#11182780] h-auto p-4 sm:p-8 rounded-[18px] border-[#374151] border-[1px]">
        <h2 className="text-white text-xl sm:text-2xl font-bold text-center sm:text-left">
          Mint from Collection
        </h2>

        <p className="text-[#9CA3AF] mt-2 text-center sm:text-left">
          Choose from the predefined NFTs. Mint mints the next available token.
        </p>

        <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {isLoadingCatalog ? (
            <p className="text-white">Loading NFTs...</p>
          ) : items.length > 0 ? (  
            items.map((nft) => (
              <div
                key={nft.id}
                className="flex flex-col h-auto bg-[#1F293780] pb-5 sm:pb-7 rounded-[12px] w-full border border-[#374151]"
              >
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-[200px] object-cover rounded-tl-[12px] rounded-tr-[12px]"
                  />
                ) : (
                  <div className="relative w-full h-[200px] bg-[#0f172a] rounded-tl-[12px] rounded-tr-[12px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 via-transparent to-[#EC4899]/20" />
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-lg sm:text-xl font-extrabold tracking-wide">
                      Mint to reveal
                    </span>
                  </div>
                )}
                <div className="w-full px-4 sm:w-4/5 mx-auto flex justify-between mt-3 sm:mt-4 flex-col gap-2 sm:gap-3.5">
                  <h3 className="text-white text-md sm:text-lg font-bold">
                    {nft.name}
                  </h3>
                  <p className="text-[#9CA3AF] text-sm sm:text-[14px]">
                    {nft.description}
                  </p>
                  <p className="text-sm">
                    <span className={nft.available ? "text-[#10B981]" : "text-[#F59E0B]"}>
                      {nft.available ? "Available" : "Minted"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No NFTs found.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-5 sm:mt-7 w-full sm:w-[90%] mx-auto items-center gap-3">
          <button
            onClick={handleMint}
            disabled={isLoading || minting}
            className="flex items-center justify-center gap-2 text-white text-lg sm:text-[18px] font-bold bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] py-3 sm:py-4 px-2 rounded-[8px] w-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {(isLoading || minting) ? (
              <span className="inline-flex items-center">
                <span className="w-5 h-5 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Minting...
              </span>
            ) : (
              <span className="inline-flex items-center">
                <img src={MintIcon} alt="Nft Logo" className="w-5 h-5 mr-2" />
                Mint Next Available
              </span>
            )}
          </button>
        </div>

        {txSuccessInfo && (
          <div className="flex justify-center items-center w-full mx-auto mt-10 sm:mt-10 px-4">
            <div className="flex flex-col w-full sm:w-4/5 md:w-3/5 bg-[#11182780] h-auto p-4 sm:p-6 rounded-[18px] border-[#10B981] border-[1px]">
              <div className="h-[60px] sm:h-[80px] w-[60px] sm:w-[80px] bg-[#10B98133] justify-center items-center rounded-full mx-auto flex mt-4">
                <img src={CheckIcon} alt="check Icon" className="w-5 sm:w-[22px] h-5 sm:h-[31px]" />
              </div>
              <h2 className="text-[#10B981] text-xl sm:text-2xl font-bold text-center">
                NFT Minted Successfully!
              </h2>
              <p className="text-[#9CA3AF] text-center text-[16px] sm:text-[18px]">
                Your NFT has been minted on-chain.
              </p>
              <div className="flex flex-col sm:flex-row justify-between mt-5 sm:mt-7 w-full sm:w-[90%] mx-auto items-center gap-3">
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-white text-[18px] font-normal bg-[#1F2937] py-3 px-2 rounded-[8px] w-full sm:w-[48%] cursor-pointer"
                >
                  <img src={ShareIcon} alt="Nft Logo" className="w-5 h-5" />
                  View Transaction
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSection;
