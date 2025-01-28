import express from "express"
import {config} from "dotenv"
import morgan from "morgan"
import cors from "cors"
config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"))
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
))
app.use("/api", require("./routes"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`))
