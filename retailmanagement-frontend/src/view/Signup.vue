<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center" class="full-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12 login-card">
          <v-card-title class="headline text-center">Sign Up</v-card-title>
          <v-card-subtitle class="text-center">
            Fill in your details to create an account
          </v-card-subtitle>

          <v-form ref="form" v-model="valid">
            <v-card-text>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                prepend-icon="mdi-account"
                outlined
                dense
                required
                
              >
              <template v-slot:append>
                  <v-icon></v-icon>
                </template>
            </v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="passwordFieldType"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="togglePasswordVisibility"
                outlined
                dense
                required
             
              >
            
            </v-text-field>

              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="First Name"
                prepend-icon="mdi-account"
                outlined
                dense
                required
             
              >
              <template v-slot:append>
                  <v-icon></v-icon>
                </template>
            </v-text-field>

              <v-text-field
                v-model="lastName"
                :rules="lastNameRules"
                label="Last Name"
                prepend-icon="mdi-account"
                outlined
                dense
                required
          
              >
              <template v-slot:append>
                  <v-icon></v-icon>
                </template>
            </v-text-field>

              <v-select
                v-model="role"
                :items="roles"
                :rules="roleRules"
                label="Role"
                prepend-icon="mdi-account-group"
                outlined
                dense
                required
            
              >
              <template v-slot:append>
                  <v-icon></v-icon>
                </template>
            </v-select>

              <v-card-actions class="d-flex flex-column align-center">
                <v-btn color="primary" @click="signUp" block large>
                  Sign Up
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="goToLogin"
                  class="sign-in-btn mt-3"
                >
                  Already have an account? Sign In
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" max-width="400px" persistent>
      <v-card
        class="d-flex align-center justify-center"
        style="
          background-color: white;
          border-radius: 12px;
          height: 200px;
          padding: 20px;
        "
      >
        <v-card-title class="text-h5" style="color: #e53935">
          <v-icon class="error-icon">mdi-alert-circle</v-icon>
          Username Already Exists
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            variant="text"
            @click="closeErrorDialog"
            style="
              font-size: 16px;
              padding: 10px 20px;
              background-color: #e53935;
            "
          >
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
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
          Account Created Successfully
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            variant="text"
            @click="closeDialog"
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
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      role: null,
      valid: false,
      roles: ["Manager", "Admin", "Customer"],
      dialog: false,
      errorDialog: false,
      successMessage: "",
      usernameRules: [(v) => !!v || "Username is required"],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
      ],
      firstNameRules: [(v) => !!v || "First Name is required"],
      lastNameRules: [(v) => !!v || "Last Name is required"],
      roleRules: [(v) => !!v || "Role is required"],
      passwordVisible: false,
    };
  },
  computed: {
    passwordFieldType() {
      return this.passwordVisible ? "text" : "password";
    },
  },
  methods: {
    async checkUsernameExists(username) {
      try {
        const response = await axios.get(
          `/api/User/CheckUsernameExists?username=${username}`
        );
        console.log("Check username response:", response.data);
        return response.data.exists;
      } catch (error) {
        console.error("Error checking username:", error);
        return false;
      }
    },

    async signUp() {
      console.log("Sign Up button clicked");
      if (this.$refs.form.validate()) {
        const usernameExists = await this.checkUsernameExists(this.username);
        if (usernameExists) {
          console.log("Username already exists, showing error dialog");
          this.errorDialog = true;
          return;
        }

        try {
          let roleId;
          switch (this.role) {
            case "Manager":
              roleId = 1;
              break;
            case "Admin":
              roleId = 2;
              break;
            case "Customer":
              roleId = 3;
              break;
            default:
              roleId = null;
          }

          const response = await axios.post("/api/User/CreateUser", {
            username: this.username,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            roleId: roleId,
            activeFlag: true,
            role: this.role,
          });

          console.log("API response:", response.data);

          if (
            response.status === 200 &&
            response.data.message === "User created successfully."
          ) {
            this.successMessage = response.data.message;
            this.dialog = true;
            console.log("Dialog should be visible");
          } else {
            console.error("Signup failed:", response.data.message);
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.data
          ) {
            console.log(
              "Handling API error response:",
              error.response.data.data
            );
            if (error.response.data.data.includes("Username already exists")) {
              this.errorDialog = true;
            }
          } else {
            console.error("There was an error during signup:", error);
          }
        }
      }
    },

    goToLogin() {
      this.$router.push("/login");
    },

    closeDialog() {
      this.dialog = false;

      // Reset the form fields
      this.username = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
      this.role = null;

      // Reset the form validation state
      this.$refs.form.reset();
    },

    closeErrorDialog() {
      this.errorDialog = false;
    },

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
  background-color: #257ba0;
}

.login-card {
  background-color: rgba(13, 13, 13, 0.386);
  padding: 20px;
  border-radius: 10px;
  max-width: 100%;
}

.v-card-title,
.v-card-subtitle {
  margin-bottom: 16px;
}

.v-card-actions {
  margin-top: 20px;
}

.v-btn {
  font-weight: bold;
}

.mt-3 {
  margin-top: 24px !important;
}

.text-center {
  text-align: center;
}

@media (max-width: 600px) {
  .login-card {
    padding: 16px;
 
  }

  .v-btn {
    font-size: 14px;
  }

  .v-card-title {
    font-size: 18px;
  }
}
</style>
