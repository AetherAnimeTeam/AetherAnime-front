import {useState} from "react";
import classes from "./Login.module.css";
import {verifyEmail} from "../../API/UserService";
import {post} from "../../API/Base";

const CodeInput = ({ setCurrentStep, email, errorCode, setError }) => {
    const [code, setCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(code.length !== 6){
            setError(5)
            return;
        }

        try {
            const response = await post(...verifyEmail({email: email, code: code}));
            if(response.status === 200)
                setCurrentStep("final");
            else if(response.status === 400)
                setError(5)
            else
                setError(5) // Todo: Another one error page
        } catch (e) {
            setError(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.Container}>
            <input
                className={errorCode === 5 ? `${classes.error} ${classes.shake}`: null}
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