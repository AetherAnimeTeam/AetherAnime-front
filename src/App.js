import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Anime from "./pages/Anime/Anime";
import Footer from "./components/Footer/Footer";
import "./styles/App.css"

function App() {
    return (
        <div className="MainContainer">
            <BrowserRouter>
                <Header/>

                <Routes>
                    <Route path="*" element={ <NotFound/> } />
                    <Route path="/" element={ <Home/> } />
                    <Route path="/anime/:id" element={ <Anime/> } />
                </Routes>

                <Footer/>
            </BrowserRouter>
        </div>
    )
}

export default App;