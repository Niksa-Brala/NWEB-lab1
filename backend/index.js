require('dotenv').config();

const express = require('express');
const pool = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');

const app = express();

app.use(cors({
    origin: process.env.REACT_APP_API_URL,
  }));
app.use(express.json());

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
    // Get the token from the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided, return an error
    if (!token) return res.status(401).json({ error: 'Error (status 401): Access token missing.' });

    // Verify the token
    jwt.verify(token, process.env.AUTH0_PUBLIC_KEY, { algorithms: ['RS256'] }, (err, user) => {
        if (err) return res.status(403).json({ error: 'Error (status 403): Invalid token.' });
        
        // Attach the decoded user to the request
        req.user = user;

        // Proceed to the next middleware/route handler
        next();
    });
};
  
app.get("/", async (req, res) => {
    try {
        const result = await pool.query('select * from tickets');
        res.json(result.rowCount)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error (status 500): Server error.');
    }
});

// POST endpoint za dodavanje nove ulaznice
app.post('/newTicket', authenticateToken, async (req, res) => {
    try {
        // Izvadi podatke iz tijela zahtjeva
        const { vatin, firstname, lastname } = req.body;
        
        // Provjera jesu li svi potrebni podaci dostavljeni
        if (!vatin || !firstname || !lastname) {
            return res.status(400).json({ error: "Error (status 400): Please fill all the required fields (vatin, firstname, lastname)." });
        };

        // Provjera koliko ulaznica s tim OIB-om postoji
        const existingTicketsWithThisOIB = await pool.query(
            "SELECT COUNT(*) FROM tickets where vatin = $1",
            [vatin]
        );

        // Dohvat broja ulaznica iz rezultata prethodnog upita
        const ticketsWithThisOIBCount = parseInt(existingTicketsWithThisOIB.rows[0].count);

        // Generiranje greške ako već postoje 3 ili više ulaznica s ovim OIB-om
        if (ticketsWithThisOIBCount >= 3) {
            return res.status(400).json({ error: "Error (status 400): Already 3 existing tickets with this vatin." });
        };

        // Kreiraj upit za unos nove ulaznice u bazu podataka
        const newTicket = await pool.query(
            "INSERT INTO tickets (vatin, firstname, lastname) VALUES ($1, $2, $3) RETURNING *",
            [vatin, firstname, lastname]
        );

        const ticketID = newTicket.rows[0].ticket_id;

        // Generiranje specifični URL ove nove ulaznice
        const ticketURL = `${process.env.REACT_APP_API_URL}/${ticketID}`;

        // Generiranje QR koda na temelju URL-a
        const qrCodeDataURL = await qrcode.toDataURL(ticketURL);

        // Postavi Content-Type na image/png
        res.setHeader('Content-Type', 'image/png');

        // Pretvori base64 sliku u binarni format i pošalji je kao PNG
        const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');

        res.send(imgBuffer); // Pošalji sliku kao response
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error (status 500): Server error.' });
    }
});

// GET endpoint za pregled generirane ulaznice
app.get('/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
  
    try {
      // Dohvati podatke o ulaznici iz baze podataka
      const result = await pool.query(
        'SELECT vatin, firstname, lastname, createdat FROM tickets WHERE ticket_id = $1',
        [ticket_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Error (status 404): Ticket not found.' });
      }
  
      // Vrati podatke o ulaznici
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      res.status(500).json({ error: 'Error (status 500): Internal server error.' });
    }
});

app.listen(5000, () => {
    console.log('Server running!');
  });