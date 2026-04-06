import axios from "axios";

// Use env variable — fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ RESPONSE INTERCEPTOR — centralised error handling
// Instead of each component catching errors differently, this
// normalises error messages into a consistent shape.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || // server sent a message
      error.message ||                 // axios/network error
      "An unexpected error occurred";

    // Re-throw with a clean message so components just do:
    // catch (err) { toast.error(err.message) }
    return Promise.reject(new Error(message));
  }
);

export default API;

//////////////////////////////////////////////////////
// ✅ TYPED API HELPERS
// Centralise all endpoint calls here so if the API
// changes, you only update one file.
//////////////////////////////////////////////////////

export interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateTransactionPayload = Omit<
  Transaction,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateTransactionPayload = Partial<CreateTransactionPayload> & {
  userId: string;
};

// GET all transactions for a user
export const getTransactions = (userId: string) =>
  API.get<Transaction[]>("/transactions", { params: { userId } });

// POST a new transaction
export const createTransaction = (payload: CreateTransactionPayload) =>
  API.post<Transaction>("/transactions", payload);

// PUT update an existing transaction
export const updateTransaction = (
  id: string,
  payload: UpdateTransactionPayload
) => API.put<Transaction>(`/transactions/${id}`, payload);

// DELETE a transaction
export const deleteTransaction = (id: string, userId: string) =>
  API.delete(`/transactions/${id}`, { data: { userId } });      