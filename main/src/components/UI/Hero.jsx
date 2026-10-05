import { useState, useEffect } from "react";
import "./Hero.css";

const Hero = () => {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    fetch("/Hero.json") 
      .then((res) => res.json())
      .then((data) => setAnime(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="MHA">
      <h1 className="MHA-h1">My Hero Academia</h1>

      <div className="MHA-list">
        {anime.map((item) => (
          <div className="MHA-card" key={item.id}>
            <img className="MHA-image" src={item.image} alt={item.title} />
            <h3 className="MHA-h3">{item.title}</h3>
            <p className="MHA-p">Episodes: {item.episodes}</p>
            <p className="MHA-p">Score: {item.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;