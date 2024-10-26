import './App.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import React, { useEffect, useState } from 'react';
import TicketPage from './TicketPage';
import { useAuth0 } from "@auth0/auth0-react";

function App() {

  const [tickets, setTickets] = useState([]);

  useEffect(() => {

    fetch('http://localhost:5000/') // Pozivaj backend API
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched tickets:", data); // Check if data is correct
        setTickets(data)
      })
      .catch(error => console.error('Error fetching tickets:', error));

  }, []);

  return (
    <div className="App">
      <div className='header-container'>
        <Header/>
      </div>
      <div className='body-container'>
        <h1>Ukupno prodano ulaznica<br/>{tickets}</h1>
      </div>
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );

}

export default App;
