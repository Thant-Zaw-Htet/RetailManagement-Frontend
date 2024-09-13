<template>
  <div class="dashboard">
    <!-- Navbar -->
    <nav class="navbar-primary">
      <div class="navbar-content">
        <v-btn class="back-button" @click="goBack" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="navbar-manager">Manager Dashboard</div>
      </div>
    </nav>

    <!-- Search Bars -->
    <div class="search-bar-container">
      <v-text-field
        v-model="date"
        label="Search Transactins by Select Date"
        type="date"
        class="search-bar"
        outlined
        dense
        @input="filterTransactions"
      ></v-text-field>
      <v-text-field
        v-model="product"
        label="Search Transactins by Product"
        class="search-bar"
        outlined
        dense
        @input="filterTransactions"
      ></v-text-field>
      <v-text-field
        v-model="transactionId"
        label="Search Transactins by Transaction ID"
        class="search-bar"
        outlined
        dense
        @input="filterTransactions"
      ></v-text-field>
    </div>

    <!-- Metrics Cards -->
    <v-container fluid class="metrics-cards">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card">
            <v-card-title>
              <v-icon class="metric-icon">mdi-cash</v-icon>
              Total Transactions
            </v-card-title>
            <v-card-subtitle>{{ totalTransactions }}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card">
            <v-card-title>
              <v-icon class="metric-icon">mdi-cart</v-icon>
              Total Selling Quantity
            </v-card-title>
            <v-card-subtitle>{{ totalSellingQuantity }}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card">
            <v-card-title>
              <v-icon class="metric-icon">mdi-cash-multiple</v-icon>
              Total Profit
            </v-card-title>
            <v-card-subtitle>{{ totalProfit }}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card">
            <v-card-title>
              <v-icon class="metric-icon">mdi-package-variant-closed</v-icon>
              Remaining Stock
            </v-card-title>
            <v-card-subtitle>{{ remainingStock }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Data Table -->
    <div class="data-container">
      <v-container fluid>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr class="column-name">
                <th class="text-left">Transaction ID</th>
                <th class="text-left">Customer</th>
                <th class="text-left">Product Code</th>
                <th class="text-left">Product Name</th>
                <th class="text-left">Total Selling Quantity</th>
                <th class="text-left">Total Profit</th>
                <th class="text-left">Total Selling Price</th>
                <th class="text-left">Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredTransactions"
                :key="item.transactionId"
                class="data"
              >
                <td>{{ item.transactionId }}</td>
                <td>{{ item.userName }}</td>
                <td>{{ item.productCode }}</td>               
                <td>{{ item.productName }}</td>
                <td>{{ item.sellingQuantity }}</td>
                <td>{{ item.totalProfit }}</td>
                <td>{{ item.costPrice }}</td>
                <td>{{ formatDate(item.transactionDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-container>
    </div>
    <div class="data-container-product">
      <v-container fluid>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr class="column-name">
                <th class="text-left">Product Code</th>
                <th class="text-left">Product Name</th>
                <th class="text-left">Stock Quantity</th>
                <th class="text-left">Selling Price</th>
                <th class="text-left">Purchase Price</th>
                <th class="text-left">Date Added</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in products"
                :key="product.productId"
                class="data"
              >
                <td>{{ product.productCode }}</td>
                <td>{{ product.productName }}</td>
                <td>{{ product.stockQuantity }}</td>
                <td>{{ product.sellingPricePerItem }}</td>
                <td>{{ product.purchasePricePerItem }}</td>
                <td>{{ formatDate(product.purchaseDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      date: "",
      product: "",
      transactionId: "",
      totalTransactions: 0,
      totalSellingQuantity: 0,
      totalProfit: 0,
      remainingStock: 0,
      transactions: [],
      products: [],
      filteredTransactions: [],
    };
  },
  created() {
    this.fetchTransactions();
    this.fetchProducts();
  },
  methods: {
    async fetchTransactions() {
      try {
        const response = await axios.get("/api/Transaction/GetTransactions");
        console.log("Transactions Data:", response.data.data);
        this.transactions = response.data.data;
        this.filteredTransactions = this.transactions;
        this.calculateMetrics();
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
    async fetchProducts() {
      try {
        const response = await axios.get("/api/Product/GetProductByAll");
        this.products = response.data.data;
        console.log("Raw Products Data:", this.products);
        console.log(this.products);
        this.calculateMetrics();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    calculateMetrics() {
      this.totalTransactions = this.filteredTransactions.length;
      this.totalSellingQuantity = this.filteredTransactions.reduce(
        (acc, curr) => acc + (curr.sellingQuantity || 0),
        0
      );
      this.totalProfit = this.filteredTransactions.reduce(
        (acc, curr) => acc + (curr.totalProfit || 0),
        0
      );

      
      this.remainingStock = this.products.reduce((acc, product) => {
        return acc + product.stockQuantity;
      }, 0);
    },
    // Calculate remaining stock based on filtered transactions
    //  this.remainingStock = this.products.reduce((acc, product) => {
    //       const totalSold = this.filteredTransactions
    //         .filter(transaction => transaction.productCode === product.productCode)
    //         .reduce((sum, transaction) => sum + transaction.sellingQuantity, 0);
    //       return acc + (product.stockQuantity - totalSold);
    //     }, 0);
    //   },

    filterTransactions() {
      const searchTerm = this.product.toLowerCase();
      const transactionIdTerm = this.transactionId.toLowerCase();
      this.filteredTransactions = this.transactions;

      if (transactionIdTerm) {
        this.filteredTransactions = this.filteredTransactions.filter(
          (transaction) =>
            transaction.transactionId.toLowerCase().includes(transactionIdTerm)
        );
      }
     
      if (searchTerm) {
        this.filteredTransactions = this.filteredTransactions.filter(
          (transaction) =>
            transaction.productName.toLowerCase().includes(searchTerm)
        );
      }

     
      if (this.date) {
        const selectedDate = new Date(this.date).setHours(0, 0, 0, 0); 
        this.filteredTransactions = this.filteredTransactions.filter(
          (transaction) => {
            const transactionDate = new Date(
              transaction.transactionDate
            ).setHours(0, 0, 0, 0); 
            return transactionDate === selectedDate;
          }
        );
      }

      console.log("Filtered Transactions:", this.filteredTransactions); // Log filtered transactions
      this.calculateMetrics();
      
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.dashboard {
  background-color: #f0f2f5;
  padding-top: 60px;
  padding-bottom: 20px;
  min-height: 100vh;
}

.navbar-primary {
  background-color: #257ba0;
  padding: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  height: 10%;
  z-index: 1000;
  color: white;
}
.navbar-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.back-button {
  margin-right: 10px;
}

.navbar-manager {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 30px;
}

.search-bar-container {
  color: black;
  display: flex;
  gap: 15px;
  margin-top: 50px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  background-color: #257ba0;
  border-radius: 4px;
}

.metrics-cards {
  margin-bottom: 40px;
}

.metric-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100px;
  margin-top: -15px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  font-size: 2rem;
  margin-right: 10px;
  color: #3a3f51;
}

.v-card-title {
  color: #3a3f51;
}

.v-card-subtitle {
  color: #3a3f51;
  font-size: 2rem;
}

.data-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  border-collapse: collapse;
}

.column-name th {
  position: sticky;
  top: 0;
  background-color: #257ba0;
  color: #ffffff;
  padding: 10px;
  font-weight: bold;
  z-index: 10;
}
.data {
  color: #3a3f51;
}
.data td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.data-container {
  margin-top: -45px;
  background-color: #a8a9ab5a;
  border-top: 20px;
}

.data-container-product {
  background-color: #a8a9ab5a;
  
}

.table-wrapper {
  max-height: 262px;
  overflow-y: auto;
}
.table-wrapper {
  max-height: 262px;
  overflow: auto; 
}

.table-wrapper::-webkit-scrollbar {
  display: none;
}

.table-wrapper {
  scrollbar-width: none;
}
</style>