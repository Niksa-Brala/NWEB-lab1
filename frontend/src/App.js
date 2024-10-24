import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import React, { useEffect, useState } from 'react';

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
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<h1>Total number of sold tickets<br/>{tickets}</h1>}/>
          <Route path='/newTicket' element={<h1>New ticket</h1>}/>
          <Route path='/login' element={<h1>Log in</h1>}/>
          <Route path='/myTickets' element={<h1>My tickets</h1>}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
