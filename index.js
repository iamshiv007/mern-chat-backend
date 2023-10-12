const express = require("express")
const app = express()

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})


app.get("/", (req, res) => {
    res.send("Hello this is test message")
})
