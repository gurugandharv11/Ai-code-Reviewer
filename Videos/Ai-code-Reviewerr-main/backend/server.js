const express = require("express")
const cors = require("cors")
value = { code }
onChange = {
    (value) => setCode(value || "") }

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Backend Running 🚀")
})

app.post("/review", (req, res) => {

    const code = req.body.code

    console.log(code)

    res.json({
        score: 82,
        issues: [
            "Weak password detected",
            "Use === instead of =="
        ],
        suggestions: [
            "Use bcrypt hashing",
            "Add input validation",
            "Improve security"
        ]
    })

})

app.listen(5000, () => {
    console.log("Server running on port 5000")
})