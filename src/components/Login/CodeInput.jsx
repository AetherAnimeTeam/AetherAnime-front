import {useState} from "react";
import classes from "./Login.module.css";

const CodeInput = ({ setIsModalOpen }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsModalOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className={classes.Container}>
        <input
          type="text"
          placeholder="Код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Далее</button>
      </form>
    );
  };

export default CodeInput;