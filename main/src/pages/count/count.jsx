import "./Count.css";
import { useState } from "react";

const Count = () => {  

    const [ count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(count + 1);
    }

     const handleDecrement = () => {
        setCount(count - 1);
    }

    return (
        <main className="cont">
            <h4>Count Demo</h4>
            <h1>Count: {count}</h1>
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
        </main>
    );
}

export default Count;