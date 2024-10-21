const express = require("express");
const app = express();
app.get("/", (req, resp) => {
    resp.send("App is up and running!")
});
app.listen(3000);