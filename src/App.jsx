import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  // Set this to the coming midnight
  const UNLOCK_TIME = new Date("2026-06-26T17:35:00");

  const base = import.meta.env.BASE_URL;

  const photos = useMemo(
    () =>
      Array.from(
        { length: 17 },
        (_, index) => `${base}photos/photo (${index + 1}).jpeg`
      ),
    [base]
  );

  function getTimeLeft() {
    const now = new Date();
    const difference = UNLOCK_TIME - now;

    if (difference <= 0) {
      return {
        total: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      total: difference,
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [isUnlocked, setIsUnlocked] = useState(getTimeLeft().total <= 0);
  const [isOpened, setIsOpened] = useState(false);

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [nextPhoto, setNextPhoto] = useState(1);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      const updatedTime = getTimeLeft();
      setTimeLeft(updatedTime);

      if (updatedTime.total <= 0) {
        setIsUnlocked(true);
      }
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  useEffect(() => {
    if (!isOpened) return;

    let current = 0;
    let timeoutId;

    setCurrentPhoto(0);
    setNextPhoto(1);
    setTransitionKey(1);

    const slideTimer = setInterval(() => {
      const next = (current + 1) % photos.length;

      setNextPhoto(next);
      setTransitionKey((prev) => prev + 1);

      timeoutId = setTimeout(() => {
        current = next;
        setCurrentPhoto(next);
      }, 2400);
    }, 3800);

    return () => {
      clearInterval(slideTimer);
      clearTimeout(timeoutId);
    };
  }, [isOpened, photos.length]);

  const handleGiftClick = () => {
    if (!isUnlocked) return;
    setIsOpened(true);
  };

  return (
    <div className={`page ${isOpened ? "opened" : ""}`}>
      {isOpened && (
        <div className="bg-slideshow">
          <img
            className="bg-image bg-current"
            src={photos[currentPhoto]}
            alt=""
          />

          <img
            key={transitionKey}
            className="bg-image bg-reveal"
            src={photos[nextPhoto]}
            alt=""
          />

          <div className="bg-dark-layer"></div>
        </div>
      )}

      {!isOpened && (
        <div className="start-area">
          {!isUnlocked && (
            <div className="countdown">
              <div>
                <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                <p>Hours</p>
              </div>

              <div>
                <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                <p>Minutes</p>
              </div>

              <div>
                <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                <p>Seconds</p>
              </div>
            </div>
          )}

          <button
            className={`gift ${isUnlocked ? "unlocked" : "locked"}`}
            onClick={handleGiftClick}
          >
            🎁
          </button>
        </div>
      )}

      {isOpened && (
        <div className="message-card">
          <div className="hearts">💖 💕 💖</div>

          <h1>Happy Birthday, My Love</h1>

          <p>
            On this beautiful day, I just want to remind you how special you are
            to me. Your smile, your kindness, and your love make my world
            brighter every single day.
          </p>

          <p>
            I am so lucky to have you in my life, Nangi.
          </p>

          <h2>I love you so much napuri ❤️</h2>
        </div>
      )}
    </div>
  );
}

export default App;