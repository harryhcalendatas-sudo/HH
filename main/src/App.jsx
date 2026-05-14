import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./LandingPage/Home";
import Count from "./pages/count/count";
import Theme from "./pages/Theme";
import Hero from "./components/UI/Hero";
import Hero2 from "./components/UI/Hero2";



const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/Hero2" element={<Hero2 />} />

                <Route path="/Hero" element={<Hero />} />

                <Route path="/Theme" element={<Theme />} />

                <Route path="/" element={<Home />} />

                <Route path="/Count" element={<Count />} />

            </Routes>        
        </BrowserRouter>
    );
}


export default App;