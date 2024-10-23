import React from 'react';
import { Link } from 'react-router-dom'

const Nav = () => {
    return (
        <div>
            <ul className='nav-ul'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/tickets">Total number of tickets</Link></li>
                <li><Link to="/newTicket">New ticket</Link></li>
                <li><Link to="/login">Log in</Link></li>
                <li><Link to="/myTickets">My tickets</Link></li>
            </ul>
        </div>
    )
}

export default Nav;