import { useEffect, useState } from "react";
import "./Hero2.css";

const Hero2 = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://api.jikan.moe/v4/anime?q=my%20hero%20academia";

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();
        setAnime(data.data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);


  const Loader = () => (
    <div className="Hero2-loader">
      <h2>Loading Anime Data...</h2>
    </div>
  );

  const AnimeCard = ({ item }) => (
    <div className="Hero2-card">
      <img src={item.images.jpg.image_url} alt={item.title} />
      <h3>{item.title}</h3>
      <p>⭐ Score: {item.score}</p>
      <p>📺 Episodes: {item.episodes}</p>
    </div>
  );

  return (
    <div className="Hero2-container">
      <h1 className="Hero2">My Hero Academia Anime List</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="Hero2-grid">
          {anime.map((item) => (
            <AnimeCard key={item.mal_id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero2;