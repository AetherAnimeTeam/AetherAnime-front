import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Anime from "./pages/Anime/Anime";
import Footer from "./components/Footer/Footer";
import "./styles/App.css"
import Questions from "./pages/Questionnaire/Questions";
import User from "./pages/User/User";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import Aya from "./pages/Aya/Aya";
import axios from "axios";
import {getUserDataByToken, refreshToken} from "./API/UserService";

function App() {
    const [userData, setUserData] = useState({})
    const [cookies, setCookie, removeCookie] = useCookies(
        ["access_token", "refresh_token"])

    useEffect(() => {
        const getData = async () => {
            if(cookies.access_token === "undefined" || cookies.access_token === undefined){
                if(cookies.refresh_token === "undefined" || cookies.refresh_token === undefined) return;
                removeCookie("access_token");
                const response = await refreshToken(cookies.refresh_token)
                setCookie("access_token", response.data.access, {maxAge: 24*60*60});
            }

            axios.get(...getUserDataByToken(cookies.access_token))
                .then(r => setUserData(r.data));
        }
        getData();
    }, []);

    return (
        <div className="MainContainer">
            <BrowserRouter>
                <Header data={userData ? userData : null} setUserData={setUserData}/>

                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/anime/:id" element={ <Anime/> } />
                    <Route path="/questions" element={ <Questions/> } />
                    <Route path="/user/:id" element={ <User/> } />
                    <Route path="/aya" element={ <Aya/> } />
                    <Route path="*" element={ <NotFound/> } />
                </Routes>

                <Footer/>
            </BrowserRouter>
        </div>
    )
}

export default App;
