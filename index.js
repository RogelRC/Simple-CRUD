import express from "express";
import "dotenv/config"
import crudRouter from "./routes/crud.route.js"

const app = express();

app.use(express.json());

app.use("/api", crudRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})