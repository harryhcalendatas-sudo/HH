import { useState, useEffect } from "react";
import "./Car.css";

const TitanCard = ({ titan }) => {
  return (
    <div className="titan-card">
      {/* Image */}
      <img
        src={titan.img || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={titan.name}
        className="titan-img"
      />

      <h3 className="titan-h3">{titan.name}</h3>

      <p><b>Height:</b> {titan.height || "Unknown"}</p>
      <p><b>Abilities:</b> {titan.abilities?.join(", ") || "Unknown"}</p>
      <p><b>Affiliation:</b> {titan.affiliation || "Unknown"}</p>
    </div>
  );
};

const Car = () => {
  const [titans, setTitans] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://api.attackontitanapi.com/titans";

  useEffect(() => {
    const fetchTitans = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setTitans(data.results.slice(0, 20));
      } catch (error) {
        console.error("Error fetching titans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTitans();
  }, []);

  return (
    <div className="titan-container">
      <h1 className="titan-h1"> Attack on Titan - Titans</h1>

      {loading ? (
        <div className="titan-loader"></div>
      ) : (
        <div className="titan-grid">
          {titans.map((titan) => (
            <TitanCard key={titan.id} titan={titan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Car;