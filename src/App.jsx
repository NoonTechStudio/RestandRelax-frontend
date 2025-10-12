import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/Home';
import LocationDetail from "./pages/LocationDetail";
import RatesPage from './pages/Rates';
import ContactUSPage from './pages/ContactUs';
import ScrollToTop from "./components/ScrollToTop";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path = "/" element = {<HomePage />} />
        <Route path="/locations-details/:id" element={<LocationDetail />}/>
        <Route path = "/rates" element = {<RatesPage />} />
        <Route path = "/contact-us" element = {<ContactUSPage />} />
      </Routes>
    </Router>
  )
}

export default App;