import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer';
import Events from './Pages/Events';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import EventDetails from './Pages/EventDetails';
import BoothsManagement from './Pages/Organizer/BoothsManagement';
import EventBooths from './Pages/Organizer/EventBooths';
import MyBooths from './Pages/Vendor/MyBooths';
import MyProfile from './Pages/MyProfile';
import Profile from './Pages/Profile';
import AddEvent from './Pages/Organizer/AddEvent';
import EditEvent from './Pages/Organizer/EditEvent';
import PaymentBooking from './Pages/Vendor/PaymentBooking';
import RefundCancelledBooking from './Pages/Organizer/RefundCancelledBooking';
import RefundDeposit from './Pages/Organizer/RefundDeposit';
import ChatBot from './Components/ChatBot';

const NO_FOOTER_ROUTES = ['/RefundCancelledBooking', '/PaymentBooking'];

const App = () => {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Events/:eventId" element={<EventDetails />}/>
        <Route path="/BoothsManagement" element={<BoothsManagement/>}/>
        <Route path="/BoothsManagement/:slug" element={<EventBooths />} />
        <Route path="/MyBooths" element={<MyBooths />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/Profile/:role/:email" element={<Profile />} />
        <Route path="/AddEvent" element={<AddEvent />} />
        <Route path="/EditEvent/:slug" element={<EditEvent />} />
        <Route path="/PaymentBooking" element={<PaymentBooking />} />
        <Route path="/RefundCancelledBooking" element={<RefundCancelledBooking />} />
        <Route path="/RefundDeposit" element={<RefundDeposit />} />
      </Routes>
      {showFooter && <Footer />}
      <ChatBot />
    </>
  )
}

export default App
