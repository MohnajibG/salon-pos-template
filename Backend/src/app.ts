import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import employeeRoutes from "./routes/employee.routes";
import categoryRoutes from "./routes/category.routes";
import serviceRoutes from "./routes/service.routes";
import clientRoutes from "./routes/client.routes";
import appointmentRoutes from "./routes/appointment.routes";
import ticketRoutes from "./routes/ticket.routes";
import publicRoutes from "./routes/public.routes";
import cashRegisterRoutes from "./routes/cashRegister.routes";
import waitlistRoutes from "./routes/waitlist.routes";
import expenseRoutes from "./routes/expense.routes";

const app = express();

/* Middlewares */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* Routes */

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/cash-register", cashRegisterRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/expenses", expenseRoutes);

/* Test Route */

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Flowdesk API Running",
  });
});

export default app;
