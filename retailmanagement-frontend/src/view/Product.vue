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
        <nav class="navbar-bg-body-tertiary-third">
          <div class="container-fluid">
            <form class="d-flex" role="search">
              <input
                class="form-control search-input"
                type="date"
                aria-label="Search"
                v-model="searchDate"
              />
            </form>
          </div>
        </nav>
      </div>
    </div>
    
    <div class="data-table-wrapper">
      <v-data-table
        :style="{ backgroundColor: '#ffffff', color: '#000000' }"
        :headers="headers"
        :items="filteredProducts"
        :sort-by="[{ key: 'No', order: 'asc' }]"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Product Management</v-toolbar-title>
            <v-dialog v-model="dialog" fullscreen hide-overlay>
              <template v-slot:activator="{ on }">
                <div class="plus-icon">
                  <v-btn class="mb-2" dark v-on="on" @click="addNewItem">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </template>
              <v-card
                class="d-flex flex-column"
                style="height: 100vh; width: 100vw"
                color="white"
              >
                <div class="nav-bar-edit">
                  <nav class="navbar-primary-edit">
                    <div class="navbar-title">
                      Thetys Computer and Mobile Sales
                      <div class="navbar-title-address">
                        3 Mya Khwar Nyo St, Yangon
                        <div class="navbar-title-phone">
                          ph - 09 123 123 123 ,09-123 123 123, 09-123 123 123
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
                <div class="card-container">
                  <v-card-title class="mt-5">
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text class="flex-grow-1">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.ProductName"
                            label="Product Name"
                            :rules="[rules.required]"
                            :error-messages="errors.ProductName"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.StockQuantity"
                            label="Stock Quantity"
                            :rules="[rules.required, rules.number]"
                            :error-messages="errors.StockQuantity"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.SellingPricePerItem"
                            label="Selling Price per Item"
                            :rules="[rules.required, rules.number]"
                            :error-messages="errors.SellingPricePerItem"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.PurchasePricePerItem"
                            label="Purchase Price per Item"
                            :rules="[rules.required, rules.number]"
                            :error-messages="errors.PurchasePricePerItem"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </div>
                <v-card-actions class="card-actions">
                  <v-spacer></v-spacer>
                  <v-btn class="cancel-button" variant="text" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn class="save-button" variant="text" @click="save">
                    Save
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px" persistent>
              <v-card
                style="
                  background-color: white;
                  border-radius: 12px;
                  height: 300px;
                  padding-top: 100px;
                  padding-left: 5px;
                "
              >
                <v-card-title class="text-h5" style="color: #257ba0">
                  Are you sure you want to delete this item?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="white"
                    variant="text"
                    @click="closeDelete"
                    style="
                      font-size: 16px;
                      padding: 10px 20px;
                      background-color: #d76169;
                    "
                  >
                    No
                  </v-btn>
                  <v-btn
                    color="white"
                    variant="text"
                    @click="deleteItemConfirm"
                    style="
                      font-size: 16px;
                      padding: 10px 20px;
                      background-color: green;
                    "
                  >
                    Yes
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="deleteSuccessDialog"
              max-width="800px"
              persistent
            >
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
                  Delete Successful
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="white"
                    variant="text"
                    @click="closeDeleteSuccess"
                    style="
                      font-size: 16px;
                      padding: 10px 20px;
                      background-color: #257ba0;
                    "
                  >
                    OK
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="updateSuccessDialog"
              max-width="800px"
              persistent
            >
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
                  Update Successful
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="white"
                    variant="text"
                    @click="closeUpdateSuccess"
                    style="
                      font-size: 16px;
                      padding: 10px 20px;
                      background-color: #257ba0;
                    "
                  >
                    OK
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="successDialog" max-width="800px" persistent>
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
                  Save Successful
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="white"
                    variant="text"
                    @click="closeSuccess"
                    style="
                      font-size: 16px;
                      padding: 10px 20px;
                      background-color: #257ba0;
                    "
                  >
                    OK
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2 pencil-icon" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon class="trash-icon" size="small" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
// import { useTheme } from 'vuetify';
// import { lightBlue } from 'vuetify/util/colors';
import axios from "axios";
// import { search } from 'core-js/fn/symbol';
// import { reactive } from 'vue';
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    successDialog: false,
    deleteSuccessDialog: false,
    updateSuccessDialog: false,
    searchId: "",
    searchDate: "",
    searchCode: "",
    searchName: "",
    headers: [
      {
        title: "No",
        key: "No",
        sortable: false,
        color: "primary",
        sortable: false,
      },
      {
        title: "Product Code",
        key: "ProductCode",
        sortable: false,
        align: "center",
      },
      {
        title: "Product Name",
        key: "ProductName",
        sortable: false,
        align: "center",
      },
      {
        title: "Stock Quantity",
        key: "StockQuantity",
        sortable: false,
        align: "center",
      },
      {
        title: "Selling Price per Item",
        key: "SellingPricePerItem",
        sortable: false,
        align: "center",
      },
      {
        title: "Purchase Price per Item",
        key: "PurchasePricePerItem",
        sortable: false,
        align: "center",
      },
      {
        title: "Purchase Date",
        key: "PurchaseDate",
        sortable: false,
        align: "center",
      },
      { title: "Actions", key: "actions", sortable: false },
    ],
    products: [],
    editedItem: {},
    defaultItem: {
      ProductName: "",
      StockQuantity: "",
      SellingPricePerItem: "",
      PurchasePricePerItem: "",
    },
    formTitle: "New Item",
    errors: {
      ProductName: [],
      StockQuantity: [],
      SellingPricePerItem: [],
      PurchasePricePerItem: [],
    },
    rules: {
      required: (value) => !!value || "Required.",
      number: (value) => !isNaN(value) || "Must be a number.",
    },
  }),
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const idMatches =
          !this.searchCode ||
          product.ProductCode.toString().includes(this.searchCode);
        const nameMatches =
          !this.searchName ||
          product.ProductName.toLowerCase().includes(
            this.searchName.toLowerCase()
          );
        const dateMatches =
          !this.searchDate ||
          (product.PurchaseDate &&
            new Date(product.PurchaseDate).toISOString().split("T")[0] ===
              this.searchDate);
        const isActive = product.ActiveFlag !== 0;
        return idMatches && nameMatches && dateMatches && isActive;
      });
    },
  },

  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("/api/Product/GetProductByAll");
        this.products = response.data.data.map((product, index) => ({
          No: index + 1,
          ProductId: product.productId,
          ProductCode: product.productCode,
          ProductName: product.productName,
          StockQuantity: product.stockQuantity,
          SellingPricePerItem: product.sellingPricePerItem,
          PurchasePricePerItem: product.purchasePricePerItem,
          PurchaseDate: product.purchaseDate
            ? new Date(product.purchaseDate).toISOString().split("T")[0]
            : "",
          ActiveFlag: product.activeFlag,
        }));
        console.log("Products:", this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    isProductNameDuplicate(name, excludeProductId = null) {
      return this.products.some(
        (product) =>
          product.ProductName.toLowerCase() === name.toLowerCase() &&
          product.ProductId !== excludeProductId // Exclude the currently edited item
      );
    },

    async addNewItem() {
      this.formTitle = "New Item";
      this.editedItem = { ...this.defaultItem };
      this.errors = {
        ProductName: [],
        StockQuantity: [],
        SellingPricePerItem: [],
        PurchasePricePerItem: [],
      };
      this.dialog = true;
    },
    editItem(item) {
      this.editedItem = { ...item };
      this.formTitle = `Edit Item - ${item.ProductId}`;
      this.errors = {
        ProductName: [],
        StockQuantity: [],
        SellingPricePerItem: [],
        PurchasePricePerItem: [],
      };
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },
    validateForm() {
      this.errors = {
        ProductName: [],
        StockQuantity: [],
        SellingPricePerItem: [],
        PurchasePricePerItem: [],
      };

      let isValid = true;
      if (!this.editedItem.ProductName) {
        this.errors.ProductName.push("Product Name is required.");
        isValid = false;
      } else if (
        this.isProductNameDuplicate(
          this.editedItem.ProductName,
          this.editedItem.ProductId
        )
      ) {
        this.errors.ProductName.push(
          "A product with this name already exists."
        );
        isValid = false;
      }
      if (
        !this.editedItem.StockQuantity ||
        isNaN(this.editedItem.StockQuantity) ||
        this.editedItem.StockQuantity < 0
      ) {
        this.errors.StockQuantity.push(
          "Stock Quantity must be a non-negative number."
        );
        isValid = false;
      }

      if (
        !this.editedItem.SellingPricePerItem ||
        isNaN(this.editedItem.SellingPricePerItem) ||
        this.editedItem.SellingPricePerItem < 0
      ) {
        this.errors.SellingPricePerItem.push(
          "Selling Price per Item must be a non-negative number."
        );
        isValid = false;
      }

      if (
        !this.editedItem.PurchasePricePerItem ||
        isNaN(this.editedItem.PurchasePricePerItem) ||
        this.editedItem.PurchasePricePerItem < 0
      ) {
        this.errors.PurchasePricePerItem.push(
          "Purchase Price per Item must be a non-negative number."
        );
        isValid = false;
      }

      return isValid;
    },
    async editSave() {},
    async save() {
      if (!this.validateForm()) {
        return;
      }
      
      if (
        !this.editedItem.ProductId &&
        this.isProductNameDuplicate(this.editedItem.ProductName)
      ) {
        this.errors.ProductName.push(
          "A product with this name already exists."
        );
        return;
      }
      try {
        const productData = {
          productName: this.editedItem.ProductName,
          stockQuantity: this.editedItem.StockQuantity,
          sellingPricePerItem: this.editedItem.SellingPricePerItem,
          purchasePricePerItem: this.editedItem.PurchasePricePerItem,
          activeFlag: this.editedItem.ActiveFlag || true,
        };

        if (this.editedItem.ProductId) {
          const response = await axios.post(
            `/api/Product/UpdateProduct?id=${this.editedItem.ProductId}`,
            productData
          );
          console.log("Update response:", response.data);
        } else {
          const response = await axios.post("/api/Product/CreateProduct", {
            products: [productData],
          });
          console.log("Create response:", response.data);
        }

        await this.fetchProducts();
        this.successDialog = true;
        this.dialog = false;
      } catch (error) {
        console.error("Error saving product:", error.response || error.message);
      }
    },

    async deleteItemConfirm() {
      try {
        await axios.post(
          `/api/Product/DeleteProductById/${this.editedItem.ProductId}`
        );
        await this.fetchProducts();
        this.dialogDelete = false;
        this.deleteSuccessDialog = true;
      } catch (error) {
        console.error("Error deactivating product:", error);
      }
    },
    closeUpdateSuccess() {
      this.updateSuccessDialog = false;
    },
    closeDeleteSuccess() {
      this.deleteSuccessDialog = false;
    },
    closeSuccess() {
      this.successDialog = false;
    },
    close() {
      this.dialog = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
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

.back-button {
  color: white;
  margin-right: 10px;
}
.navbar-bg-body-tertiary-third {
  background-color: #257ba0;
  border-radius: 4px;
  flex: 1;
}

.search-input {
  color: #ffffff70;
  width: 100%;
  padding: 10px;
}

.search-input::placeholder {
  color: #ffffff70;
  opacity: 1;
}
.back-button .v-icon {
  color: #257ba0;
  font-size: 1.5rem;
}
.navbar-title {
  color: #000000;
  margin-left: 10px;
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

.pencil-icon {
  background-color: #257ba0;
  width: 70px;
  color: #ffffff;
  border-radius: 7%;
  padding: 7%;
  cursor: pointer;
}

.trash-icon {
  background-color: #d76169;
  width: 70px;
  border-radius: 7%;
  padding: 7%;
  cursor: pointer;
}
.mb-2 {
  background-color: #4ab1eb;
  color: #ffffff;
  border-radius: 5px;
  display: flex;
}
.plus-icon {
  margin-right: 170px;
  margin-top: 10px;
}
.nav-bar-edit {
  background-color: #257ba0;
  padding: 1rem;
  position: absolute;
  top: 0;
  width: 100%;
  height: 15%;
  z-index: 1000;
}

.card-container {
  margin-top: 10%;
}
.data-table-wrapper {
  max-height: 580px;
  overflow-y: auto;
  overflow-x: hidden;
}
.data-table-wrapper::-webkit-scrollbar {
  display: none;
}
.card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cancel-button {
  background-color: #d76169;
  color: white;
}

.save-button {
  background-color: #257ba0;
  color: white;
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
</style>
