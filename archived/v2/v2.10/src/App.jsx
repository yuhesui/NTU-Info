const React = window.React;
const { HashRouter, Routes, Route } = ReactRouterDOM;

import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ClubsExplorerPage from './pages/ClubsExplorerPage.jsx';
import AirportGuidePage from './pages/AirportGuidePage.jsx';
import RoomLayoutsPage from './pages/RoomLayoutsPage.jsx';
import FoodReviewsPage from './pages/FoodReviewsPage.jsx';
import CampusCyclingMapPage from './pages/CampusCyclingMapPage.jsx';
import GpaCalculatorPage from './pages/GpaCalculatorPage.jsx';
import ConcessionCardCalculatorPage from './pages/ConcessionCardCalculatorPage.jsx';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clubs" element={<ClubsExplorerPage />} />
          <Route path="/airport-guide" element={<AirportGuidePage />} />
          <Route path="/room-layouts" element={<RoomLayoutsPage />} />
          <Route path="/food-reviews" element={<FoodReviewsPage />} />
          <Route path="/cycling-map" element={<CampusCyclingMapPage />} />
          <Route path="/gpa-calculator" element={<GpaCalculatorPage />} />
          <Route path="/concession-card-calculator" element={<ConcessionCardCalculatorPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
