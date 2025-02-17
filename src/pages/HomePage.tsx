import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import thiran from '../assets/thiranlogo.png'
import sece from '../assets/sece.png'

const HomePage = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  
  const eventDetails = {
    name: "AI ARENA",
    date: "February 21, 2025",
    time: "9:00 AM - 2:00 PM",
    venue: "Full Stack Lab"
  };

  const handleEnterChallenge = () => {
    if (!teamName.trim()) {
      setError('Please enter your team name');
      return;
    }

    // Check if team already exists
    const existingTeamData = localStorage.getItem(`team_${teamName.trim()}`);
    if (existingTeamData) {
      const teamData = JSON.parse(existingTeamData);
      navigate(`/problem/${teamData.problemId}`);
    } else {
      // Generate a random problem ID for new team
      const problemId = Math.floor(Math.random() * 20) + 1;
      const teamData = {
        teamName: teamName.trim(),
        problemId,
        timeLeft: 90 * 60, // 90 minutes in seconds
        startTime: Date.now(),
        isStarted: true
      };
      localStorage.setItem(`team_${teamName.trim()}`, JSON.stringify(teamData));
      navigate(`/problem/${problemId}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Top-left Image */}
      <img 
        src={sece} 
        alt="Top Left" 
        className="absolute left-4 top-10 w-80 z-50"
      />

      {/* Top-right Image */}
      <img 
        src={thiran}
        alt="Top Right" 
        className="absolute -mt-6 right-14 w-48 h-48 z-50"
      />

      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('https://img.freepik.com/free-vector/abstract-gradient-circuit-board-background_52683-14562.jpg?t=st=1739785452~exp=1739789052~hmac=c84bc48396c67d867d4dcddecaed690b888759116b5a7880403b94cbc01b85b5&w=1060')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-center mb-8 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              {eventDetails.name}
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center md:justify-center">
                <Calendar className="w-6 h-6 mr-3 text-purple-400" />
                <span className="text-2xl">{eventDetails.date}</span>
              </div>
              
              <div className="flex items-center justify-center md:justify-center">
                <Clock className="w-6 h-6 mr-3 text-purple-400" />
                <span className="text-2xl">{eventDetails.time}</span>
              </div>
              
              <div className="flex items-center justify-center md:justify-center">
                <MapPin className="w-6 h-6 mr-3 text-purple-400" />
                <span className="text-2xl">{eventDetails.venue}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl border border-purple-500/20">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 mr-3 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Team Registration</h2>
              </div>
              
              <div className="mb-6">
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Your Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter team name"
                />
                {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
              </div>
              
              <button
                onClick={handleEnterChallenge}
                className="group relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-lg hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <span className="relative flex items-center">
                  Enter Challenge
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 opacity-20 group-hover:opacity-30 blur transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
