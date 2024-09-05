<template>
  <div>
    <nav class="navbar-primary">
      <div class="navbar-title">
        <v-btn class="back-button" @click="goBack" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        Thetys Computer and Mobile Sales
        <div class="navbar-title-address">
          3 Mya Khwar Nyo St, Yangon
          <div class="navbar-title-phone">
            ph - 09 123 123 123, 09-123 123 123, 09-123 123 123
          </div>
        </div>
      </div>
    </nav>
    <v-dialog v-model="showEmptyCartDialog" max-width="500px">
      <v-card class="custom-dialog-card">
        <v-card-title class="headline center-title"
          >No Products Selected</v-card-title
        >
        <v-card-text class="center-text">
          Please add products to your cart before saving.
        </v-card-text>
        <v-card-actions class="center-actions">
          <v-spacer></v-spacer>
          <v-btn
            class="close-btn"
            color="white"
            text
            @click="showEmptyCartDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTransactionsDialog" max-width="1000px">
      <v-card class="white-background">
        <v-card-title
          class="headline"
          style="background-color: #257ba0; color: white"
        >
          Transaction History
        </v-card-title>
        <v-data-table
          :headers="transactionHeaders"
          :items="transactions"
          item-key="transactionId"
          class="white-background"
        >
          <!-- Define custom slot for date formatting -->
          <template v-slot:item.transactionDate="{ item }">
            {{ item.transactionDate }}
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="showTransactionsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="search-bar">
      <div class="search-container">
        <nav class="navbar-bg-body-tertiary-first">
          <div class="container-fluid">
            <form class="d-flex" role="search">
              <input
                class="form-control search-input"
                type="search"
                placeholder="Search products by code"
                aria-label="Search"
                v-model="searchCode"
              />
            </form>
          </div>
        </nav>

        <nav class="navbar-bg-body-tertiary-second">
          <div class="container-fluid">
            <form class="d-flex" role="search">
              <input
                class="form-control search-input"
                type="search"
                placeholder="Search products by name"
                aria-label="Search"
                v-model="searchName"
              />
            </form>
          </div>
        </nav>
        <v-btn class="transactions-button" @click="fetchTransactionsTable" icon>
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="main-content">
      <div class="image-container-wrapper">
        <div class="image-container">
          <div
            v-for="product in filteredProducts"
            :key="product.Code"
            class="image-wrapper"
            :class="{ 'low-stock': product.StockQuantity === 0 }"
            @click="addToCart(product)"
          >
            <div class="product-info">
              <p class="product-id">Code: {{ product.Code }}</p>
              <p class="product-name">{{ product.ProductName }}</p>
              <p class="product-price">
                {{ product.SellingPricePerItem | currency }}
              </p>
              <p class="product-stock">Stock: {{ product.StockQuantity }}</p>
            </div>
          </div>
        </div>
        <
      </div>

      <div class="cart-section">
        <div class="cart-container">
          <div class="cart-header">
            <h2>Shopping Cart</h2>
          </div>
          <div class="cart-body">
            <div
              v-for="(item, index) in cart"
              :key="item.ProductId"
              class="cart-item"
            >
              <div class="cart-item-info">
                <!-- Cross button to remove the item -->
                <button
                  class="clear-item-button"
                  @click="removeFromCart(index)"
                >
                  <v-icon>mdi-close</v-icon>
                </button>
                <p>{{ item.ProductName }}</p>
              </div>
              <div class="cart-item-actions">
                <button @click="decreaseQuantity(index)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(index)">+</button>
              </div>
              <div class="cart-item-price">
                <p>Total Price: {{ item.totalPrice | currency }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-total">
          <p>Total Quantity: {{ totalQuantity }}</p>
          <p>Total Price of All Items: {{ totalCartPrice | currency }}</p>
          <v-btn @click="saveCart" color="green">Save</v-btn>
        </div>
      </div>
    </div>
  </div>
  <v-dialog v-model="paymentSuccessDialog" max-width="800px" persistent>
    <v-card
      class="d-flex align-center justify-center"
      style="
        background-color: white;
        border-radius: 12px;
        height: 8cm;
        padding: 20px;
      "
    >
      <v-card-title class="text-h5" style="color: #257ba0">
        <v-icon class="success-icon">mdi-check-circle</v-icon>
        Payment Successful
      </v-card-title>
      <v-card-text>Your payment has been processed successfully!</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="white"
          @click="closePaymentSuccess"
          style="font-size: 16px; padding: 10px 20px; background-color: #257ba0"
        >
          OK
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showStockLimitDialog" max-width="400px">
    <v-card class="stock-limit-dialog-card">
      <v-card-title class="headline center-title"
        >Stock Limit Reached</v-card-title
      >
      <v-card-text class="center-text">
        <v-icon class="warning-icon">mdi-alert-circle</v-icon>
        You have reached the stock limit for this product.
      </v-card-text>
      <v-card-actions class="center-actions">
        <v-spacer></v-spacer>
        <v-btn
          class="close-btn"
          color="white"
          @click="showStockLimitDialog = false"
        >
          Close
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
      <div class="d-flex justify-center align-center">
        {{ snackbar.message }}
        <v-btn class="ml-4" color="white" text @click="snackbar.show = false">Close</v-btn>
      </div>
    </v-snackbar>
  
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "App",
  data() {
    return {
      showDialog: false,
      showEmptyCartDialog: false,
      showTransactionsDialog: false,
      searchId: "",
      searchName: "",
      searchCode: "",
      products: [],
      cart: [],
      transactions: [],
      snackbar: {
        show: false,
        message: '',
        color: 'error'
      },
      showTransactionsTable: false,
      paymentSuccessDialog: false,
      showStockLimitDialog: false,
      transactionHeaders: [
        {
          title: "Transaction ID",
          key: "transactionId",
          sortable: false,
          align: "center",
        },
        {
          title: "Product Code",
          key: "productCode",
          sortable: false,
          align: "center",
        },
        {
          title: "Product Name",
          key: "productName",
          sortable: false,
          align: "center",
        },
        {
          title: "Selling Quantity",
          key: "sellingQuantity",
          sortable: false,
          align: "center",
        },
        {
          title: "Total Profit",
          key: "totalProfit",
          sortable: false,
          align: "center",
        },
        {
          title: "Cost Price",
          key: "costPrice",
          sortable: false,
          align: "center",
        },
        {
          title: "Transaction Date",
          key: "transactionDate",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const codeMatches =
          !this.searchCode || product.Code.toString().includes(this.searchCode);
        const nameMatches =
          !this.searchName ||
          product.ProductName.toLowerCase().includes(
            this.searchName.toLowerCase()
          );
        const isActive = product.ActiveFlag !== 0;
        return codeMatches && nameMatches && isActive;
      });
    },
    totalQuantity() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalCartPrice() {
      return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("/api/Product/GetProductByAll");
        this.products = response.data.data.map((product, index) => ({
          No: index + 1,
          Code: product.productCode,
          ProductName: product.productName,
          StockQuantity: product.stockQuantity,
          SellingPricePerItem: product.sellingPricePerItem,
          PurchasePricePerItem: product.purchasePricePerItem,
          ActiveFlag: product.activeFlag,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    addToCart(product) {
      const productIndex = this.products.findIndex(
        (p) => p.Code === product.Code
      );
      const itemIndex = this.cart.findIndex(
        (item) => item.Code === product.Code
      );

      if (itemIndex !== -1) {
        // Existing item in cart
        if (this.cart[itemIndex].quantity < this.cart[itemIndex].maxQuantity) {
          this.$set(this.cart, itemIndex, {
            ...this.cart[itemIndex],
            quantity: this.cart[itemIndex].quantity + 1,
            totalPrice:
              (this.cart[itemIndex].quantity + 1) *
              this.cart[itemIndex].SellingPricePerItem,
          });
          this.products[productIndex].StockQuantity--;
        } else {
          this.showStockLimitDialog = true; // Show stock limit dialog
        }
      } else {
        // New item in cart
        if (product.StockQuantity > 0) {
          this.cart.push({
            ...product,
            quantity: 1,
            totalPrice: product.SellingPricePerItem,
            maxQuantity: product.StockQuantity,
          });
          this.products[productIndex].StockQuantity--;
        } else {
          this.showSnackbar("Product is out of stock.", "error");
        }
      }
    },
    showSnackbar(message, color = 'error') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    increaseQuantity(index) {
      const productIndex = this.products.findIndex(
        (p) => p.Code === this.cart[index].Code
      );
      if (this.cart[index].quantity < this.cart[index].maxQuantity) {
        this.cart[index].quantity++;
        this.cart[index].totalPrice =
          this.cart[index].quantity * this.cart[index].SellingPricePerItem;
        this.products[productIndex].StockQuantity--;
      }
    },
    decreaseQuantity(index) {
      const productIndex = this.products.findIndex(
        (p) => p.Code === this.cart[index].Code
      );
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.cart[index].totalPrice =
          this.cart[index].quantity * this.cart[index].SellingPricePerItem;
        this.products[productIndex].StockQuantity++;
      }
    },
    removeFromCart(index) {
      const productIndex = this.products.findIndex(
        (p) => p.Code === this.cart[index].Code
      );
      this.products[productIndex].StockQuantity += this.cart[index].quantity;
      this.cart.splice(index, 1);
    },
    async saveCart() {
      if (this.cart.length === 0) {
        this.showEmptyCartDialog = true;
        return;
      }
      try {
        const transactions = this.cart.map((item) => ({
          productName: item.ProductName,
          sellingQuantity: item.quantity,
        }));

        console.log("Sending transactions:", transactions);

        const response = await axios.post(
          "/api/Transaction/CreateTransaction",
          transactions
        );

        console.log("Transaction saved:", response.data);

        this.cart = [];
        this.paymentSuccessDialog = true;
        this.fetchTransactions();
      } catch (error) {
        console.error("Error saving cart:", error);
        alert("Failed to save the cart. Please try again.");
      }
    },
    async fetchTransactionsTable() {
      try {
        const response = await axios.get("/api/Transaction/GetTransactions");
        this.transactions = response.data.data.map((transaction) => {
          const dateStr = transaction.transactionDate;
          const date = new Date(dateStr);

          const formattedDate = !isNaN(date.getTime())
            ? date.toLocaleDateString()
            : "Invalid Date";

          return {
            transactionId: transaction.transactionId,
            // productId: transaction.productId,
            productCode: transaction.productCode,
            productName: transaction.productName,
            sellingQuantity: transaction.sellingQuantity,
            totalProfit: transaction.totalProfit,
            costPrice: transaction.costPrice,
            transactionDate: formattedDate,
          };
        });
        console.log("Formatted transactions:", this.transactions);
        this.showTransactionsDialog = true;
        this.showTransactionsTable = true;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Failed to fetch transactions. Please try again.");
      }
    },
    async fetchTransactions() {
      try {
        const response = await axios.get("/api/Transaction/GetTransactions");
        this.transactions = response.data.data.map((transaction) => {
          const dateStr = transaction.transactionDate;
          const date = new Date(dateStr);

          const formattedDate = !isNaN(date.getTime())
            ? date.toLocaleDateString()
            : "Invalid Date";

          return {
            transactionId: transaction.transactionId,
            productId: transaction.productId,
            productName: transaction.productName,
            sellingQuantity: transaction.sellingQuantity,
            totalProfit: transaction.totalProfit,
            costPrice: transaction.costPrice,
            transactionDate: formattedDate,
          };
        });
        console.log("Formatted transactions:", this.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Failed to fetch transactions. Please try again.");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    closePaymentSuccess() {
      this.paymentSuccessDialog = false;
    },
  },
  filters: {
    currency(value) {
      return value.toLocaleString("th-TH", {
        style: "currency",
        currency: "THB",
      });
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
#app {
  background-color: rgb(255, 255, 255);
}
.transactions-button {
  margin-left: 10px;
}
.white-background {
  background-color: white !important;
  color: #000000;
}
.transactions-button .v-icon {
  font-size: 1.5rem;
}
.navbar-primary {
  background-color: #257ba0;
  padding: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  height: 16%;
  z-index: 1000;
  color: white;
}
.custom-dialog-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
}

.center-title {
  text-align: center;
}

.center-text {
  text-align: center;
  margin-bottom: 20px;
}

.center-actions {
  display: flex;
  justify-content: center; 
}

.close-btn {
  border-radius: 4px;
  background-color: #d76169;
  font-weight: bold;
}

.navbar-title {
  color: #000000;
  font-size: 1.5rem;
  margin-left: 10px;
  flex: 1;
}
.back-button {
  color: white;
  margin-right: 10px;
}

.back-button .v-icon {
  color: #257ba0;
  font-size: 1.5rem;
}

.navbar-title-address {
  color: #000000;
  margin-left: 630px;
  font-size: 1.5rem;
}

.navbar-title-phone {
  color: #000000;
  margin-left: 650px;
  font-size: 1.5rem;
}

.search-bar {
  padding: 20px;
  margin-top: 7%;
}

.search-container {
  width: 50%;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.navbar-bg-body-tertiary-first,
.navbar-bg-body-tertiary-second {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 10px;
}

.navbar-bg-body-tertiary-first,
.navbar-bg-body-tertiary-second {
  border-radius: 5px;
  background-color: #257ba0;
}

.search-input::placeholder {
  color: #ffffff70;
  opacity: 1;
}

.main-content {
  display: flex;
  width: 110%;
}

.image-container-wrapper {
  flex: 3;
  max-width: 65%;
  border-radius: 2px;
  padding-right: 100px;
  height: 72vh;
  overflow-y: auto;
  background-color: #ffffff;
  -webkit-overflow-scrolling: touch;
}

.image-container-wrapper::-webkit-scrollbar {
  display: none;
}

.image-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0px; /* Adjust the gap between cards as needed */
  margin-left: 10px;
}
.product-id,
.product-price,
.product-stock {
  color: #000000;
}
.image-wrapper {
  position: relative;
  margin: 8px;
  width: 312px;
  height: 200px;
  background-color: #d9d9d9;
  border: 1px solid #6e6e6e8e;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.image-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.image-wrapper:active {
  transform: scale(0.95);
}
.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
  text-align: center;
}
.low-stock {
  background-color: #d76169 !important;
  color: white !important;
}
.cart-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 500px;
  height: 650px;
  margin-right: 250px;
  margin-left: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.cart-header {
  font-size: 1.5rem;
  color: #000000;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
  background-color: #257ba0;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
}

.cart-container {
  background-color: #eae6e6;
  width: 550px;

  height: calc(100% - 80px);
  overflow-y: scroll;
}
.cart-container::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.cart-container::-webkit-scrollbar-thumb {
  background: transparent;
}

.cart-total {
  background-color: #1e5f80;
  color: #ffffff;
  padding: 12px;
  border-radius: 5px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  width: 110%;
}

.cart-header {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #000000;
}

.cart-body {
  margin-right: 10px;
}
.success-icon {
  font-size: 2rem;
  color: #257ba0;
  margin-right: 10px;
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 10px;
  margin-left: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  width: 100%;
  color: #000000;
}
.custom-dialog-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
}

.cart-item-info {
  flex: 2;
  display: flex;
  align-items: center;
  position: relative;
}

.clear-item-button {
  background-color: red;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 10px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-item-button:hover {
  background-color: darkred;
}

.clear-item-button .v-icon {
  font-size: 1rem;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.cart-item-actions button {
  background-color: #257ba0;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.cart-item-price {
  text-align: center;
  width: 30%;
}
.cart-item-actions button:hover {
  background-color: #1a5a6b;
}

.cart-item-actions span {
  font-size: 1.2rem;
  min-width: 40px;
  text-align: center;
}
.v-dialog {
  border-radius: 8px;
}

.v-card-title {
  font-weight: bold;
  color: #4caf50;
}

.v-card-text {
  color: #757575;
}

.white-background {
  background-color: white !important;
}

.v-card-title {
  font-weight: bold;
  color: #4caf50;
}

.v-card-text {
  color: #757575;
}
.stock-limit-dialog-card {
  background-color: #fef4f4;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.warning-icon {
  font-size: 2rem;
  color: #ff5722;
  margin-bottom: 10px;
}

.close-btn {
  border-radius: 4px;
  background-color: #ff5722;
  color: white;
  font-weight: bold;
}

.close-btn:hover {
  background-color: #e64a19;
}

.center-title {
  text-align: center;
}

.center-text {
  text-align: center;
  margin-bottom: 20px;
}

.center-actions {
  display: flex;
  justify-content: center;
}
</style>
