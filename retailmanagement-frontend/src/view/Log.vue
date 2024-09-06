<template>
  <div id="app">
    <nav class="navbar">
      <ul class="nav-links">
     
      </ul>
    </nav>
    <div class="content">
      <div class="photo-gallery">
        <div class="photo-item">
          <RouterLink to="/product">
            <img src="D:/RetailManagement-Frontend/retailmanagement-frontend/src/images/product-management.png" alt="Product Management" />
          </RouterLink>
          <h2>Product Management</h2>
        </div>
        <div class="photo-item">
          <RouterLink to="/sale">
          <img src="D:/RetailManagement-Frontend/retailmanagement-frontend/src/images/start-transaction.png" alt="Start Transaction" />
        </RouterLink>
          <h2>Start Sale</h2>
        </div>
        <div class="photo-item">
          <RouterLink to="/dashboard">
          <img src="D:/RetailManagement-Frontend/retailmanagement-frontend/src/images/dashboard.png" alt="Dashboard" />
        </RouterLink>
          <h2>Dashboard</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: "App",
};
</script>

<style scoped>
#app {
  background-color: rgb(255, 255, 255);
}

.navbar {
  background-color: #257BA0; 
  padding: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  height: 15%;
  z-index: 1000;
}

.nav-links {
  list-style: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.nav-links a:hover {
  text-decoration: underline;
}

.content {
  padding-top: 15%; 
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
}

.photo-gallery {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; 
  padding: 5%;
}


.photo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  max-width: 30%;
}

.photo-item img {
  width: 100%;
  height: 200px; 
  object-fit: contain; 
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.photo-item h2 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}
</style>
