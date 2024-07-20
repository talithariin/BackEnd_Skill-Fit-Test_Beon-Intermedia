import express from "express";
import dotenv from "dotenv";
import connection from "./models/connection.js";
import residentRoute from "./routes/resident.route.js";
import houseRoute from "./routes/house.route.js";
import houseResidentRoute from "./routes/houseResident.route.js";
import feeTypeRoute from "./routes/feeType.route.js";
import paymentRoute from "./routes/payment.route.js";
import incomeRoute from "./routes/income.route.js";
import expenseRoute from "./routes/expense.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to My Web App" });
});
app.use("/resident", residentRoute);
app.use("/house", houseRoute);
app.use("/house-resident", houseResidentRoute);
app.use("/fee", feeTypeRoute);
app.use("/payment", paymentRoute);
app.use("/income", incomeRoute);
app.use("/expense", expenseRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

connection.getConnection((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL successfully");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
