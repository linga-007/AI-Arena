import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSound from "use-sound";
import { problems } from "../data/problems";
import { formatTime } from "../utils/timer";
import { Clock, Users } from "lucide-react";
import { TeamData } from "../types";

const TIMER_DURATION = 90 * 60; // 90 minutes in seconds
const WARNING_TIME = 15 * 60; // 15 minutes in seconds

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(true);

  const [playBeep] = useSound("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  const [playLongBeep] = useSound("https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3");

  useEffect(() => {
    // Fetch team data from localStorage
    const allTeams = Object.keys(localStorage)
      .filter((key) => key.startsWith("team_"))
      .map((key) => JSON.parse(localStorage.getItem(key) || "{}"));

    const currentTeam = allTeams.find((team) => team.problemId === Number(id));

    if (!currentTeam) {
      navigate("/");
      return;
    }

    setTeamData(currentTeam);

    // Get stored start time or initialize it
    let startTime = currentTeam.startTime || Date.now();
    if (!currentTeam.startTime) {
      currentTeam.startTime = startTime;
      localStorage.setItem(`team_${currentTeam.teamName}`, JSON.stringify(currentTeam));
    }

    // Calculate remaining time dynamically
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    setTimeLeft(Math.max(TIMER_DURATION - elapsedTime, 0));
  }, [id, navigate]);

  useEffect(() => {
    if (!isRunning || !teamData) return;

    // Prevent back navigation
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      history.pushState(null, "", window.location.href);
    };

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          setIsRunning(false);
          playLongBeep();
          return 0;
        }

        if (newTime === WARNING_TIME) {
          playBeep();
        }

        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      window.onpopstate = null;
    };
  }, [isRunning, playBeep, playLongBeep, teamData]);

  if (!teamData) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-6 mb-8 shadow-lg border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-3 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Team: {teamData.teamName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 mr-3 text-purple-400" />
              <span className="text-3xl font-mono text-white">{formatTime(timeLeft)}</span>
              <div className={`px-4 py-2 rounded ${timeLeft <= WARNING_TIME ? "bg-red-600" : "bg-purple-600"}`}>
                {timeLeft <= WARNING_TIME ? "Warning: Time running out!" : "Time remaining"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 md:p-8 shadow-lg border border-purple-500/20">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            {problems.find((p) => p.id === Number(id))?.title || "Problem Title"}
          </h1>
          <div className="prose prose-invert !max-w-fit">
            <p className="text-xl leading-relaxed text-gray-300">
              {problems.find((p) => p.id === Number(id))?.description || "Problem Description"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
