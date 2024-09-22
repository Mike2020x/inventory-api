import express from "express";
import {
  getCustomers,
  //   getCustomerById,
  createCustomer,
  getCustomerById,
} from "@/controllers/customers";

const customersRouter = express.Router();
//customersRouter.get("/customers", getCustomersV2);

customersRouter.post("/customers", createCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
export default customersRouter;
