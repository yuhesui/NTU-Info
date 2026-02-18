import React from 'https://esm.sh/react@18.2.0';
import { HashRouter, Routes, Route } from 'https://esm.sh/react-router-dom@6';

import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ClubsExplorerPage from './pages/ClubsExplorerPage.jsx';
import AirportGuidePage from './pages/AirportGuidePage.jsx';
import RoomLayoutsPage from './pages/RoomLayoutsPage.jsx';
import FoodReviewsPage from './pages/FoodReviewsPage.jsx';
import CampusCyclingMapPage from './pages/CampusCyclingMapPage.jsx';
import GpaCalculatorPage from './pages/GpaCalculatorPage.jsx';
import ConcessionCardCalculatorPage from './pages/ConcessionCardCalculatorPage.jsx';
import MoocCreditTransferGuidePage from './pages/MoocCreditTransferGuidePage.jsx';
import OverseasExchangeGuidePage from './pages/OverseasExchangeGuidePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';

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
          <Route path="/mooc-guide" element={<MoocCreditTransferGuidePage />} />
          <Route path="/overseas-exchange" element={<OverseasExchangeGuidePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
