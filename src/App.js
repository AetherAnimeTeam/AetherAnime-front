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
import user from "./pages/User/User";
import {useCookies} from "react-cookie";
import Aya from "./pages/Aya/Aya";

function App() {
    const [userInfo, setUserInfo] = useState({})
    const [cookies, setCookie] = useCookies(["access_token", "refresh_token"])
    // // TODO: replace dummy login
    useEffect(() => {
        if(cookies.access_token) setUserInfo({name: "ADMIN"});
    }, [cookies]);


    return (
        <div className="MainContainer">
            <BrowserRouter>
                <Header userName={userInfo.name ? userInfo.name : null}/>

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
