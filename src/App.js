import './styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Anime from "./pages/Anime/Anime";
import Footer from "./components/Footer/Footer";
import Questions from "./pages/Questionnaire/Questions";
import User from "./pages/User/User";
import Aya from "./pages/Aya/Aya";
import EasterEgg from "./pages/EasterEgg/EasterEgg";

function App() {
  return (
    <div className="MainContainer">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<Anime />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/aya" element={<Aya />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/polina" element={<EasterEgg />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;