import cors from "cors"
import {config} from "dotenv"
import express from "express"
import morgan from "morgan"

import plantRouter from "./router/plant.routes"
import requirementsRouter from "./router/requirements.routes"
import authRouter from "./router/user.routes"

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
app.use("/user", authRouter)
app.use("/plant", plantRouter)
app.use("/requirements", requirementsRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`))
