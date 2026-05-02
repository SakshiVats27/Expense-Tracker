import { axiosClient } from "./axiosClient";
import { toast } from 'react-hot-toast';

export const getUserExpenses = async () => {
    try {
        const response = await axiosClient.post('/expenses/allExpenses', {});
        const exp = response.data.message.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return exp;
    } catch (error) {
        console.log(error.message);
    }
}

export const getExpensesPage = async (params = {}) => {
    try {
        const response = await axiosClient.get('/expenses/list', { params });
        return response.data.message;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.response?.data?.message || "Could not load transactions");
    }
}

export const getCategorySummary = async (params = {}) => {
    try {
        const response = await axiosClient.get('/expenses/categorySummary', { params });
        return response.data.message;
    } catch (error) {
        console.log(error.message);
    }
}

export const getTotalsSummary = async (params = {}) => {
    try {
        const response = await axiosClient.get('/expenses/totalsSummary', { params });
        return response.data.message;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.response?.data?.message || "Could not load totals");
    }
}

export const createExpense = async (expInfo) => {
    try {
        const response = await axiosClient.post('/expenses/addExpense', expInfo);
        if (response.data.statusCode !== 201) {
            throw new Error(response.data.message || "Could not add transaction");
        }
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.response?.data?.message || error.message || "Could not add transaction");
    }
}

export const deleteExpense = async (data) => {
    try {
        const { expenseId } = data;
        const response = await axiosClient.post('/expenses/deleteExpense', { expenseId });
        if (response.data.statusCode !== 200) {
            throw new Error(response.data.message || "Could not delete transaction");
        }
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.response?.data?.message || error.message || "Could not delete transaction");
    }
}

export const sendEmail = async (sender, data) => {
    try {
        const response = await axiosClient.post('/expenses/sendEmail', {
            recipient: sender,
            body: data
        });
        toast.success("Email sent");
        return response;
    } catch (e) {
        console.log(e.message);
        return e.message;
    }
}

export const getBudget = async () => {
    try {
        const response = await axiosClient.get('/budget/getBudget');
        return response.data.message;
    } catch (error) {
        console.error("Error fetching budget:", error.message);
    }
}

export const updateBudget = async (budgetData) => {
    try {
        const response = await axiosClient.post('/budget/updateBudget', budgetData);
        toast.success("Budget updated");
        return response.data.message;
    } catch (error) {
        console.error("Error updating budget:", error.message);
    }
}

export const getAdvancedAnalytics = async () => {
    try {
        const response = await axiosClient.get('/analytics/advanced');
        return response.data.message;
    } catch (error) {
        console.log(error.message);
    }
}
