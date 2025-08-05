import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-6 border-t border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-3 md:mb-0">
            <p className="text-gray-300 font-medium">
              © 2025 SDKThunder. Visas tiesības aizsargātas.
            </p>
          </div>
          
          <div className="flex items-center text-gray-400">
            <span className="font-medium">Izstrāde:</span>
            <a 
              href="https://facebook.com/MairisDigital" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1 bg-slate-800/50 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-slate-600 hover:border-red-500"
            >
              MairisDigital
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;