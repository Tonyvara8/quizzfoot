<template>
  <div class="main-card">
    <div class="card-header">
      <i class="fas fa-trophy fa-3x gold-icon"></i>
      <h1>KICK OFF</h1>
      <p>{{ HaveAccount ? 'Enter the Stadium' : 'Join the League' }}</p>
    </div>

    <div v-if="HaveAccount">
      <form @submit.prevent="seconnecter">
        <div class="input-group">
          <i class="fas fa-user"></i>
          <input 
            v-model="Connect.Username" 
            type="text" 
            placeholder="Player Name"
            required>
        </div>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input 
            v-model="Connect.Password" 
            type="password" 
            placeholder="Password"
            required>
        </div>

        <button type="submit" class="btn-primary">ENTER PITCH</button>
      </form>

      <div class="toggle-container">
        <p>New player?</p>
        <a @click.prevent="CreateA" class="toggle-link">Create an Account</a>
      </div>
    </div>

    <div v-else>
      <form @submit.prevent="creercompte">
        <div class="input-group">
          <i class="fas fa-user-plus"></i>
          <input 
            v-model="newUser.Username" 
            type="text" 
            placeholder="Choose Username"
            required>
        </div>

        <div class="input-group">
          <i class="fas fa-key"></i>
          <input 
            v-model="newUser.Password" 
            type="password" 
            placeholder="Choose Password"
            required>
        </div>

        <button type="submit" class="btn-primary">SIGN CONTRACT</button>
      </form>

      <div class="toggle-container">
        <p>Already have a team?</p>
        <a @click.prevent="CreateA" class="toggle-link">Log in</a>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginKickOff',
  data() {
    return {
      HaveAccount: true,
      token: "",
      newUser: {
        Username: '',
        Password: ''
      },
      Connect: {
        Username: '',
        Password: ''
      }
    }
  },
  methods: {
    async seconnecter() {
      try {
        const response = await axios.post('http://localhost:3000/api/connect', this.Connect);
        console.log("Réponse complète du serveur :", response);
    console.log("Ce qu'il y a dans data :", response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', this.Connect.Username); 
        localStorage.setItem('score', response.data.user.score);
      localStorage.setItem('role',response.data.user.role);
        this.$emit('login-success', this.Connect.Username);

        this.Connect = { Username: '', Password: '' };
        console.log("Connecté");
      } catch (error) {
        alert("Mauvais mot de passe ou pseudo.");
      }
    },

    CreateA() {
      console.log("Click reçu ! Changement de mode."); 
      this.HaveAccount = !this.HaveAccount;
    },

    async creercompte() {
      try {
        await axios.post('http://localhost:3000/api/Create', this.newUser);
        alert("Compte créé ! Connectez-vous maintenant.");
        this.newUser = { Username: '', Password: '' };
        this.HaveAccount = true;
      } catch (error) {
        alert("Erreur: " + (error.response?.data?.error || "Erreur inconnue"));
      }
    }
  }
};
</script>

<style scoped>
.toggle-container {
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 0.9em;
}

.toggle-link {
  color: #2ecc71;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  
  position: relative;
  z-index: 100; 
  display: inline-block; 
  padding: 5px; 
}

.toggle-link:hover {
  color: #27ae60;
}
</style>