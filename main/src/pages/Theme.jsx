import { useState, useEffect } from "react";
import "./Theme.css";

const Theme = () => {
  const [isDark, setIsDark] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (isDark) {
      setText("Night Mode");
    } 
    
    else {
      setText("Day Mode");
    }

  }, [isDark]);

  return (
    <main className={`theme ${isDark ? "dark" : "light"}`}> 
      <div className="themecon">
        <h1>{text}</h1>

        {/* ✅ Only one paragraph will show */}
        {isDark ? (
          <p className="p">Good Night!😴</p>
        ) : (
          <p className="p">Good Morning!</p>
        )}
        <button onClick={() => setIsDark(!isDark)} className="bttn">
          Switch
        </button>
      </div>
    </main>
  );
};

export default Theme;