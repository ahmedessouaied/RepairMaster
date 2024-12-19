import React from 'react';
import { Star } from 'lucide-react';

const ProfileDetails = () => {
  const profile = {
    name: "Emna Maalej",
    rating: 4.5,
    description: "Professional plumber with 10+ years of experience specializing in residential and commercial plumbing services. Licensed and insured.",
    email: "emna.maalej@example.com",
    phone: "+1 (555) 123-4567",
    reviews: [
      {
        id: 1,
        author: "John Doe",
        rating: 5,
        comment: "Excellent work on fixing our kitchen sink. Very professional and thorough.",
        date: "2024-03-15"
      },
      {
        id: 2,
        author: "Sarah Smith",
        rating: 4,
        comment: "Quick response and good service. Would recommend.",
        date: "2024-03-10"
      }
    ]
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-6">
          <img
            src="/api/placeholder/80/80"
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-red-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center mt-2">
              {renderStars(profile.rating)}
              <span className="ml-2 text-gray-600">{profile.rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-700">{profile.description}</p>
        </div>

        {/* Contact Information */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-600">{profile.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-600">{profile.phone}</span>
          </div>
        </div>
      </div>

      {/* Past Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Past Reviews</h2>
        <div className="space-y-4">
          {profile.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{review.author}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;