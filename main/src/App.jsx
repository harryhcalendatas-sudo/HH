import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./LandingPage/Home";
import Count from "./pages/count/count";
import Theme from "./pages/Theme";
import Hero from "./components/UI/Hero";
import Hero2 from "./components/UI/Hero2";
import Activity from "./pages/Activity/Calendatas_Harry_3A..js";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/Hero2" element={<Hero2 />} />

                <Route path="/Hero" element={<Hero />} />

                <Route path="/Theme" element={<Theme />} />

                <Route path="/" element={<Activity />} />

                <Route path="/Home" element={<Home />} />

                <Route path="/Count" element={<Count />} />

                <Route path="/Activity" element={<Activity />} />

            </Routes>        
        </BrowserRouter>
    );
}


export default App;