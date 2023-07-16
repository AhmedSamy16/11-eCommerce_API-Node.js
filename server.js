import { config } from "dotenv"
config()

import app from "./app.js"
import connectDB from "./config/connectDB.js"

const main = async () => {
    const PORT = process.env.PORT
    await connectDB()
    app.listen(PORT, () => {
        console.log(`App running on port ${PORT}`)
    })
}

main()