import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return (
        <main className="Group9">
            <h1 className="hel">BSIT-2A Group 9 Members</h1>

            <p>This Group needs to be Revamped.</p>

            <section>
                <ul>
                    <li><strong>Member 1:</strong> Sean Benedict C. De Atras</li>
                    <li><strong>Member 2:</strong> Arlon S. Llacer</li>
                    <li><strong>Member 3:</strong> Enaro M. Caber</li>
                    <li><strong>Member 4:</strong> Harry H. Calendatas</li>
                </ul>
            </section>

            <div className="links">
                <h2>Project Compilation</h2>

                <Link to="/Hero" className="nav-link">
                    Hero Static JSON
                </Link>

                <Link to="/Hero2" className="nav-link">
                    Hero API
                </Link>

                <Link to="/Theme" className="nav-link">
                    Theme Switcher
                </Link>

                <Link to="/Count" className="nav-link">
                    Counter App
                </Link>

            </div>
        </main>
    );
}

export default Home;