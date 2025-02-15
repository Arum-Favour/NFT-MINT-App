import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FormSection from "./components/FormSection";
import NftGallery from "./components/NftGallery";
import WalletProvider from "./WalletProvider.jsx";

function App() {
  return (
    <WalletProvider>
      <div className="bg-gradient-to-r from-[#000000] to-[#111827] min-h-screen w-full mx-auto overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <FormSection />
        <NftGallery />
      </div>
    </WalletProvider>
  );
}

export default App;
