import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { loadModels } from "../utiles/loadModels.js";

const searchSongs = async (mood) => {
  const proxy = "https://cors-anywhere.herokuapp.com/";
  // First, try with mood
  let query = `bollywood ${mood} songs`;
  let apiUrl = `https://api.deezer.com/search?q=${query}`;
  try {
    let res = await fetch(proxy + apiUrl);
    let data = await res.json();
    let results = data.data.slice(0, 10);
    if (results.length > 0) return results;
    // Fallback: try generic bollywood songs
    query = `bollywood songs`;
    apiUrl = `https://api.deezer.com/search?q=${query}`;
    res = await fetch(proxy + apiUrl);
    data = await res.json();
    results = data.data.slice(0, 10);
    return results;
  } catch {
    return [];
  }
};

const Loader = () => (
  <div className="flex flex-col items-center justify-center mt-6">
    <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-2 text-purple-600 font-semibold animate-pulse">
      Detecting...
    </span>
  </div>
);

const Toast = ({ message, onClose, type = "error" }) => (
  <div
    className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
      type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
    }`}
  >
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-lg font-bold">
      ×
    </button>
  </div>
);

const MusicPlayers = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [expression, setExpression] = useState("");
  const [songs, setSongs] = useState([]); // List of suggestions
  const [currentSong, setCurrentSong] = useState(null); // Currently playing song
  const [error, setError] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        await loadModels();
        setModelsLoaded(true);
      } catch {
        setError(
          "Failed to load face detection models. Please refresh the page."
        );
        setShowToast(true);
      }
    };
    load();
  }, []);

  const startListening = async () => {
    setError("");
    setLoading(true);
    setSongs([]);
    setCurrentSong(null);
    setExpression("");
    setShowToast(false);
    setListening(true);
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
    try {
      const img = await faceapi.fetchImage(image);
      const detections = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      if (detections && detections.expressions) {
        const exp = detections.expressions;
        const sorted = Object.entries(exp).sort((a, b) => b[1] - a[1]);
        const mood = sorted[0][0];
        setExpression(mood);
        const fetchedSongs = await searchSongs(mood);
        if (fetchedSongs && fetchedSongs.length > 0) {
          setSongs(fetchedSongs);
          // Pick a random song to play
          const randomSong =
            fetchedSongs[Math.floor(Math.random() * fetchedSongs.length)];
          setCurrentSong(randomSong);
        } else {
          setError("No Bollywood songs found for this mood. Try again!");
          setShowToast(true);
        }
      } else {
        setError(
          "No face detected. Please try again with your face clearly visible."
        );
        setShowToast(true);
      }
    } catch {
      setError("An error occurred during face detection or song fetching.");
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-gray-200 flex items-center">
        <span className="font-bold text-lg text-gray-800 tracking-tight">
          🎵 VIBEBEATS
        </span>
      </header>
      {/* Toast for errors/info */}
      {showToast && error && (
        <Toast
          message={error}
          onClose={() => setShowToast(false)}
          type="error"
        />
      )}
      {/* Main Section */}
      <main className="max-w-4xl mx-auto mt-10 flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Webcam/Photo */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={260}
              height={260}
              videoConstraints={{ facingMode: "user" }}
              className="object-cover w-[260px] h-[260px]"
            />
          </div>
        </div>
        {/* Info and Button */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Live Mood Detection
            </h1>
            <p className="text-gray-600 max-w-md">
              Your current mood is being analyzed in real-time. Enjoy music
              tailored to your feelings.
            </p>
          </div>
          <button
            onClick={startListening}
            disabled={!modelsLoaded || loading}
            className={`px-5 py-2 rounded-md font-semibold text-white transition-all duration-200 ${
              !modelsLoaded || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Detecting..." : "Start Listening"}
          </button>
          {expression && !error && (
            <div className="text-gray-700 text-base mt-2">
              <span className="font-semibold">Detected Mood:</span>{" "}
              <span className="capitalize">{expression}</span>
            </div>
          )}
        </div>
      </main>
      {/* Loader */}
      {loading && <Loader />}
      {/* Recommended Tracks */}
      {songs.length > 0 && !error && (
        <section className="max-w-2xl mx-auto mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recommended Tracks
          </h2>
          <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow">
            {songs.map((song, idx) => (
              <li
                key={song.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  {song.album && song.album.cover && (
                    <img
                      src={song.album.cover}
                      alt="Album Art"
                      className="w-12 h-12 rounded shadow border border-purple-200"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 leading-tight">
                      {song.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {song.artist.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentSong(song)}
                  className="ml-4 p-2 rounded-full hover:bg-purple-100 transition"
                  aria-label={`Play ${song.title}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* Audio Player (fixed at bottom if a song is selected) */}
      {currentSong && !error && (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg flex items-center justify-center py-3 z-40">
          <div className="flex items-center gap-4">
            {currentSong.album && currentSong.album.cover && (
              <img
                src={currentSong.album.cover}
                alt="Album Art"
                className="w-12 h-12 rounded shadow border border-purple-200"
              />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-purple-800 text-md">
                {currentSong.title}
              </span>
              <span className="text-gray-600 text-sm">
                {currentSong.artist.name}
              </span>
            </div>
            <audio
              controls
              src={currentSong.preview}
              className="ml-4 w-56"
              autoPlay
            />
          </div>
        </div>
      )}
      {/* Model loading info */}
      {!modelsLoaded && !error && (
        <div className="mt-4 text-gray-500 animate-pulse text-center">
          Loading face detection models...
        </div>
      )}
      {/* Info note */}
      <div className="mt-8 text-sm text-gray-500 max-w-md text-center mx-auto mb-8">
        <p>
          <b>Note:</b> If you get a CORS error, visit{" "}
          <a
            href="https://cors-anywhere.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            cors-anywhere
          </a>{" "}
          and click "Request temporary access".
          <br />
          For best results, ensure your face is well-lit and clearly visible to
          the webcam.
        </p>
      </div>
    </div>
  );
};

export default MusicPlayers;
