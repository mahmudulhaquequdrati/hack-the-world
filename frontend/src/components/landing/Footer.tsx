import { Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-green-400/20 py-8 px-6 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Terminal className="w-6 h-6 text-green-400" />
          <span className="font-bold text-green-400">CyberSec Academy</span>
        </div>
        <div className="text-green-300/60 text-sm">
          © 2024 CyberSec Academy. All rights reserved. Hack responsibly.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
