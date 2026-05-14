import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Landing Page/Home";
import Count from "./pages/count/Count";
import Theme from "./pages/Theme";
import Hero from "./components/UI/Hero";
import Hero2 from "./components/UI/Hero2";
import Car from "./Yance/Car";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                 <Route path="/Car" element={<Car />} />

                <Route path="/Hero2" element={<Hero2 />} />

                <Route path="/Hero" element={<Hero />} />

                <Route path="/theme" element={<Theme />} />

                <Route path="/" element={<Home />} />

                <Route path="/count" element={<Count />} />

            </Routes>        
        </BrowserRouter>
    );
}


export default App;