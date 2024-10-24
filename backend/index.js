const express = require('express');
const pool = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');

const app = express();
app.use(cors());
app.use(express.json())

app.get("/", async (req, res) => {
    try {
        const result = await pool.query('select * from tickets');
        res.json(result.rowCount)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Kreiraj POST endpoint za dodavanje nove ulaznice
app.post('/newTicket', async (req, res) => {
    try {
        // Izvadi podatke iz tijela zahtjeva
        const { vatin, firstname, lastname } = req.body;
        
        // Provjera jesu li svi potrebni podaci dostavljeni
        if (!vatin || !firstname || !lastname) {
            return res.status(400).json({ error: "Greška! Molimo ispunite sva polja (vatin, firstname, lastname)." });
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
            return res.status(400).json({ error: "Greška! Za navedeni su OIB već kupljene 3 ulaznice." });
        };

        // Kreiraj upit za unos nove ulaznice u bazu podataka
        const newTicket = await pool.query(
            "INSERT INTO tickets (vatin, firstname, lastname) VALUES ($1, $2, $3) RETURNING *",
            [vatin, firstname, lastname]
        );

        const ticketID = newTicket.rows[0].ticket_id;

        // Generiranje specifični URL ove nove ulaznice
        const ticketURL = `http://localhost:3000/${ticketID}`;

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
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
  });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });