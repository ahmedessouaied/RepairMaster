import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RepairJobDetails = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const jobDetails = {
    owner: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 234-5678",
      image: "/api/placeholder/64/64"
    },
    repair: {
      title: "Leaking Bathroom Faucet Repair",
      description: "Need urgent repair for a constantly dripping bathroom faucet. The leak has been ongoing for about a week and is getting worse. The faucet is a dual-handle model installed around 5 years ago. Would prefer someone who can come in the next 2-3 days.",
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      location: "Brooklyn, NY",
      postedDate: "2024-03-18"
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? jobDetails.repair.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === jobDetails.repair.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the bid submission
    console.log('Bid submitted:', bidAmount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      {/* Owner Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={jobDetails.owner.image}
            alt={jobDetails.owner.name}
            className="w-16 h-16 rounded-full border-2 border-red-500"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{jobDetails.owner.name}</h2>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email: </span>
                {jobDetails.owner.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone: </span>
                {jobDetails.owner.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Repair Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{jobDetails.repair.title}</h1>
        
        {/* Image Gallery */}
        <div className="relative mb-6">
          <img
            src={jobDetails.repair.images[currentImageIndex]}
            alt={`Repair image ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover rounded-lg"
          />
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {jobDetails.repair.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {jobDetails.repair.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 object-cover rounded cursor-pointer ${
                currentImageIndex === index ? 'border-2 border-red-500' : ''
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="mt-2 text-gray-700">{jobDetails.repair.description}</p>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-4">📍 {jobDetails.repair.location}</span>
            <span>📅 Posted: {jobDetails.repair.postedDate}</span>
          </div>
        </div>
      </div>

      {/* Bid Submission Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Your Bid</h3>
        <form onSubmit={handleBidSubmit} className="space-y-4">
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount ($)
            </label>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your bid amount"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-red-600 transition-colors"
          >
            Submit Bid
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepairJobDetails;