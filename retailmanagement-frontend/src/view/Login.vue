<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center" class="full-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12 login-card">
          <v-card-title class="headline text-center">Sign In</v-card-title>
          <v-card-subtitle class="text-center">
            Please enter your credentials to continue
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
                outlined
                dense
                required
                
                
              >
                <template v-slot:append>
                  <v-icon @click="togglePasswordVisibility">
                    {{ passwordFieldIcon }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-row>
                <v-col cols="12">
                  <v-btn color="primary" @click="login" block large>Sign In</v-btn>
                </v-col>
                <v-col cols="12" class="text-center mt-3">
                  <v-btn text color="primary" @click="goToSignUp" width="10px"
                    >Don't have an account? Sign Up Now</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="headline text-center">Login Error</v-card-title>
        <v-card-text>
          <p>{{ errorMessage }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="errorDialog = false">Close</v-btn>
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
      valid: false,
      errorDialog: false,
      errorMessage: "",
      passwordVisible: false, 
      usernameRules: [(v) => !!v || "Username is required"],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
      ],
    };
  },
  computed: {
    passwordFieldType() {
      return this.passwordVisible ? 'text' : 'password';
    },
    passwordFieldIcon() {
      return this.passwordVisible ? 'mdi-eye' : 'mdi-eye-off';
    }
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const response = await axios.post("/api/Login/Login", {
            username: this.username,
            password: this.password,
          });

          if (response.data.status === 0 && response.data.data) {
            const { token, ...user } = response.data.data;

            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("username", this.username); 
            localStorage.setItem("userId", response.data.data.userId);


            const roleId = user.roleId;

            switch (roleId) {
              case 1:
                this.$router.push("/dashboard");
                break;
              case 2:
                this.$router.push("/product");
                break;
              case 3:
                this.$router.push("/sale");
                break;
              default:
                console.error("Invalid RoleId");
                this.$router.push("/");
                break;
            }
          } else {
            this.errorMessage = "Login failed. Please check your credentials.";
            this.errorDialog = true;
          }
        } catch (error) {
          this.errorMessage = "An error occurred while trying to log in.";
          this.errorDialog = true;
        }
      }
    },
    
    goToSignUp() {
      this.$router.push("/sign-up");
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
  padding: 40px;
  border-radius: 10px;
  max-width: 100%;
}

.v-card-title,
.v-card-subtitle {
  margin-bottom: 20px;
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
    padding: 20px;
  }

  .v-btn {
    font-size: 14px;
  }

  .v-card-title {
    font-size: 18px;
  }
}
</style>