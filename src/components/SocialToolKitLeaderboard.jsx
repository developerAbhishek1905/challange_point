import React from 'react';
import { Crown, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const SocialToolKitLeaderboard = () => {
  const leaderboardData = [
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
    { id: 1, company: "Company one Solutions", website: "companyonesolutions.com", employees: 520, category: "Technology" },
  ];

  const CompanyCard = ({ position, isTop = false, crownColor = "text-gray-400" }) => (
    <div className={`bg-green-700 text-white rounded-lg p-6 ${isTop ? 'transform -translate-y-4' : ''} relative`}>
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-full p-2">
          <Crown className={`h-6 w-6 ${crownColor}`} />
        </div>
      </div>
      <div className="text-center mt-4">
        <h3 className="font-semibold text-lg mb-4">Company one Solutions</h3>
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-gray-300">Employees</p>
            <p className="font-semibold">500</p>
          </div>
          <div>
            <p className="text-gray-300">Category</p>
            <p className="font-semibold">Technology</p>
          </div>
        </div>
        <p className="text-sm">companyonesolutions.com</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center 
    ">
      {/* Header */}
      <div className='p-8 flex flex-col items-center bg-gradient-to-br from-teal-800 via-teal-700 w-full  to-teal-900'>
      <nav className="bg-[#7a9d72]  w-[80%] backdrop-blur-sm rounded-lg mx-4 px-10 p-4">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold">STK</h1>
            <p className="text-sm opacity-90">SOCIAL TOOL KIT</p>
          </div>
          <div className="hidden md:flex text-xl space-x-8 text-white">
            <a href="#" className="hover:text-green-200 transition-colors">Home</a>
            <a href="#" className="hover:text-green-200 transition-colors">About Us</a>
            <a href="#" className="hover:text-green-200 transition-colors">Contact Us</a>
          </div>
          <div className="md:hidden">
            <button className="text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 ">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-8">
          UNDER HARD DEVELOPMENT - DEMONSTRATION<br />
          STATIC PAGE
        </h2>
        <p className="text-[#2E4629] text-lg md:text-3xl font-bold">
          This <span className="underline text-[#7a9d72] decoration-[#7a9d72]">application</span> aims to be used by companies. But we all have a choice<br className="hidden md:block" />
          <span className="underline text-[#7a9d72] decoration-[#7a9d72]">inside</span>
        </p>
      </div>
      </div>

      {/* Main Content */}
      <div className='absolute min-h-screen w-full flex flex-col items-center md:top-[65%] top-[70%]'>
      <div className="bg-gray-50 min-h-screen rounded-4xl w-[95%] rounded-3xl ">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Top Leaderboard</h2>

          {/* Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <CompanyCard position={2} crownColor="text-gray-400" />
            </div>
            <div className="order-1 md:order-2">
              <CompanyCard position={1} isTop={true} crownColor="text-yellow-500" />
            </div>
            <div className="order-3 md:order-3">
              <CompanyCard position={3} crownColor="text-amber-600" />
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mb-8">
            <button className="text-gray-600 hover:text-gray-800 font-medium">
              View All Leaderboard &gt;
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">S. No.</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Website</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employees</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.company}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                        <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer">
                          {item.website}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.employees}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2e4629] text-white py-12 w-full ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center font-bold space-x-8 mb-6">
              <a href="#" className="hover:text-green-300 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-green-300 transition-colors">Privacy Policy</a>
            </div>
            <div className=' h-[1px] w-full bg-white'></div>
            <div className='flex justify-around mt-8'>
            
            <p className="text-sm opacity-75">© 2025 Company challenges</p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="hover:text-green-300 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default SocialToolKitLeaderboard;