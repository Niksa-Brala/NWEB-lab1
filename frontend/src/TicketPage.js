import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './components/Footer';
import TicketHeader from './components/TicketHeader';

function TicketPage() {
  const { ticket_id } = useParams();  // Dohvati ticket_id iz URL-a
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    // Funkcija za dohvaćanje podataka ulaznice
    const fetchTicketData = async () => {
      try {
        const response = await fetch(`https://nweb-lab1.onrender.com/${ticket_id}`);
        const data = await response.json();
        setTicketData(data);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    };

    fetchTicketData();
  }, [ticket_id]);

  if (!ticketData) {
    return <div> ticket data...</div>;
  }

  // Funkcija za formatiranje timeStampa u DD/MM/YYYY HH:mm:ss
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-satni format
    }).format(date);
};

  return (
    <div className="App">
      <div className='header-container'>
        <TicketHeader/>
      </div>
      <div className='body-container'>
        <h1>Informacije o ulaznici</h1>
        <p><strong>OIB: </strong> {ticketData.vatin}</p>
        <p><strong>Ime: </strong> {ticketData.firstname}</p>
        <p><strong>Prezime: </strong> {ticketData.lastname}</p>
        <p><strong>Vrijeme nastanka ulaznice: </strong> {formatDateTime(ticketData.createdat)}</p>
      </div>
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
}

export default TicketPage;
