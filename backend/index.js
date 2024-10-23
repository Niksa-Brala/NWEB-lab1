const express = require('express');
const pool = require('./db')
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json())

app.get("/tickets", async (req, res) => {
    try {
        const result = await pool.query('select * from tickets');
        console.log(result.rowCount)
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
        
        // Provjeri jesu li svi potrebni podaci dostavljeni
        if (!vatin || !firstname || !lastname) {
            return res.status(400).json({ error: "Molimo ispunite sva polja (vatin, firstname, lastname)." });
        }

        // Kreiraj upit za unos nove ulaznice u bazu podataka
        const newTicket = await pool.query(
            "INSERT INTO tickets (vatin, firstname, lastname) VALUES ($1, $2, $3) RETURNING *",
            [vatin, firstname, lastname]
        );

        // Vrati novokreiranu ulaznicu kao odgovor
        // res.json(newTicket.rows[0]);
        console.log("Nova ulaznica stvorena");
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