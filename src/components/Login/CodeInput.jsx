import {useState} from "react";
import classes from "./Login.module.css";
import {verifyEmail} from "../../API/UserService";
import {post} from "../../API/Base";

const CodeInput = ({ setCurrentStep, email, error, setError }) => {
    const [code, setCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(code.length !== 6){
            setError("Код должен состоять из 6 цифр!")
        }

        try {
            const response = await post(...verifyEmail({email: email, code: code}));
            if(response.status === 200)
                setCurrentStep("final");
            else if(response.status === 400)
                setError("Неправильный код!")
            else
                setError(response.data.error)
        } catch (e) {
            setError(e);
        }
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
          <p className={classes.ErrorText}>{error}</p>
        <button type="submit">Далее</button>
      </form>
    );
  };

export default CodeInput;