import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSound from "use-sound";
import { problems } from "../data/problems";
import { formatTime } from "../utils/timer";
import { Clock, Users, Link as LinkIcon } from "lucide-react";
import { TeamData } from "../types";
import longBeep from "../assets/long-beep.mp3";

const TIMER_DURATION = 180 * 60; 
const WARNING_TIME = 15 * 60; 

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(true);

  const [playBeep] = useSound("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  const [playLongBeep] = useSound(longBeep);

  useEffect(() => {
    const allTeams = Object.keys(localStorage)
      .filter((key) => key.startsWith("team_"))
      .map((key) => JSON.parse(localStorage.getItem(key) || "{}"));

    const currentTeam = allTeams.find((team) => team.problemId === Number(id));

    if (!currentTeam) {
      navigate("/");
      return;
    }

    setTeamData(currentTeam);
    let startTime = currentTeam.startTime || Date.now();
    if (!currentTeam.startTime) {
      currentTeam.startTime = startTime;
      localStorage.setItem(`team_${currentTeam.teamName}`, JSON.stringify(currentTeam));
    }

    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    setTimeLeft(Math.max(TIMER_DURATION - elapsedTime, 0));
  }, [id, navigate]);

  useEffect(() => {
    if (!isRunning || !teamData) return;

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

  const problem = problems.find((p) => p.id === Number(id));

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
            {problem?.title || "Problem Title"}
          </h1>
          <div className="prose prose-invert !max-w-fit">
            <p className="text-xl leading-relaxed text-gray-300">
              {problem?.description || "Problem Description"}
            </p>
          </div>
        </div>

        {problem?.dataset_link && (
          <div className="mt-6 bg-gray-900 rounded-lg p-4 shadow-md border border-purple-500/20">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-purple-400" />
              <a
                href={problem.dataset_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text underline"
              >
                Dataset Link
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;