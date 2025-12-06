<template>
  <div class="app-layout">
    
    <aside class="sidebar">  
      
      <div class="sidebar-header">
        
        <h3 class="user-name">{{ isConnected ? pseudo : 'VISITOR' }}</h3>
        <span v-if="isConnected" class="user-role">{{ role }}</span>
      </div>

      <nav class="sidebar-menu">
        <button @click="changeView('home')" :class="{ active: currentView === 'home' }">
          <i class="fas fa-home"></i> <span>Home</span>
        </button>

        <template v-if="isConnected">
            <button @click="changeView('matches')" :class="{ active: currentView === 'matches' }">
              <i class="far fa-futbol"></i> <span>Matchs</span>
            </button>

            <button @click="changeView('ranking')" :class="{ active: currentView === 'ranking' }">
              <i class="fas fa-chart-line"></i> <span>Ranking</span>
            </button>
        </template>
      </nav>

      <div class="user-info" v-if="isConnected">
        <div class="logout-container" @click="logout">
            <i class="fas fa-sign-out-alt logout-icon"></i>
            <span class="logout-text">Sign out</span>
        </div>
      </div>
    </aside>


    <main class="main-content">
      
      <div v-if="currentView === 'home'" class="center-content">
        <div v-if="isConnected" style="text-align:center; color: white;">
            <i class="fas fa-futbol fa-4x" style="color:#f1c40f; margin-bottom:20px;"></i>
            <h1>Ready for the match , {{ pseudo }} ?</h1>
            <p>The changing room is open. Select "Matches" on the left.</p>
        </div>
        <Login v-else @login-success="handleLogin" />
      </div>

      <Matches v-if="currentView === 'matches'" />

      <Ranking v-if="currentView === 'ranking'" />

    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Login from './components/Login.vue';
import Matches from './components/Matches.vue';
import Ranking from './components/Ranking.vue';

const isConnected = ref(false);
const currentView = ref('home');
const pseudo = ref('');
const role = ref('');

onMounted(() => {
    const token = localStorage.getItem('token');
    if (token) {
        updateUserSession();
    }
});

const updateUserSession = () => {
    isConnected.value = true;
    pseudo.value = localStorage.getItem('username') || 'Joueur';
    role.value = localStorage.getItem('role') || 'student';
    currentView.value = 'matches';
};

const changeView = (viewName) => {
    if ((viewName === 'matches' || viewName === 'ranking') && !isConnected.value) {
        alert("Connecte-toi d'abord !");
        currentView.value = 'home';
    } else {
        currentView.value = viewName;
    }
};

const handleLogin = () => {
    updateUserSession();
};

const logout = () => {
    localStorage.clear();
    window.location.reload();
};
</script>

<style>

body { margin: 0; background-color: #1e272e; color: white; font-family: 'Poppins', sans-serif; }

.app-layout { display: flex; min-height: 100vh; min-width: 78vw; }

.sidebar {
    /* J'ai ajouté une largeur fixe ici sinon le menu est écrasé */
    width: 260px; flex-shrink: 0; 
    background: #0f1519; display: flex; flex-direction: column; padding: 20px;
    border-right: 2px solid #2ecc71; 
}
.sidebar-header { text-align: center; margin-bottom: 40px; color: #f1c40f; }
.sidebar-menu { display: flex; flex-direction: column; gap: 15px; flex-grow: 1; }
.sidebar-menu button {
    background: transparent; border: none; color: #95a5a6; text-align: left; font-size: 1.1rem;
    padding: 15px; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 10px; width: 100%;
}
.sidebar-menu button:hover, .sidebar-menu button.active { background: #2ecc71; color: white; font-weight: bold; }

.user-info { margin-top: auto; padding-top: 15px; border-top: 1px solid #34495e; display: flex; justify-content: center; align-items: center; }
.logout-icon { color: #e74c3c; cursor: pointer; font-size: 1.2rem; }

.main-content { padding: 20px;
    overflow-y: auto;
    background: radial-gradient(circle, #27ae60, #0f3e27);
    border-radius: 9px;
    /* J'ai corrigé le 927% qui cassait le layout en flex: 1 */
    flex: 1; 
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
 }
.center-content { display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; }
/* --- VERSION MOBILE (Téléphones) --- */
@media (max-width: 768px) {
    .app-layout { 
        flex-direction: column; 
    }

    /* BARRE DU HAUT */
    .sidebar { 
        width: 100%; 
        height: 60px; /* Hauteur fixe */
        flex-direction: row; 
        align-items: center; 
        justify-content: space-between; 
        padding: 0 15px; 
        border-right: none; 
        border-bottom: 3px solid #2ecc71;
        background-color: #0f1519;
        position: relative;
        z-index: 100;
    }
    
    /* 1. GAUCHE : Profil (Petit) */
    .sidebar-header { 
        margin: 0; padding: 0; border: none;
        display: flex; align-items: center; gap: 10px; 
        flex-shrink: 0;
    }
    .avatar-container { width: 35px; height: 35px; font-size: 1rem; margin: 0; border: 2px solid white; }
    .avatar-container i { font-size: 1rem; } /* Force la taille de l'icône user */
    .user-name { font-size: 0.9rem; margin: 0; color: white; }
    .user-role { display: none; }
    
    /* 2. CENTRE : Menu (Icônes forcées en BLANC) */
    .sidebar-menu { 
        flex-direction: row; 
        gap: 15px; /* Espace entre les boutons */
        justify-content: center;
        flex-grow: 1; 
        margin: 0 10px;
    }
    
    .sidebar-menu button { 
        padding: 0;
        width: 40px; 
        height: 40px;
        justify-content: center; 
        border-radius: 50%; /* Boutons bien ronds */
        color: #ecf0f1 !important; /* FORCE LA COULEUR BLANCHE */
        display: flex;
        align-items: center;
    }
    
    /* Le fond vert au survol ou actif */
    .sidebar-menu button.active, .sidebar-menu button:hover {
        background: #2ecc71;
        color: #0f1519 !important; /* Devient noir sur fond vert */
    }

    .sidebar-menu button span { display: none; } /* Cache le texte */
    
    .sidebar-menu button i {
        display: block !important; /* FORCE L'AFFICHAGE DE L'ICONE */
        font-size: 1.2rem;
        margin: 0;
    }
    
    /* 3. DROITE : Logout */
    .user-info { margin: 0; padding: 0; border: none; flex-shrink: 0; }
    .logout-text { display: none; }
    
    .logout-container {
        background: #e74c3c;
        padding: 0;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .logout-icon { color: white !important; font-size: 1rem; margin: 0; }

    /* Ajustement contenu */
    .main-content { padding: 10px; }
    .center-content h1 { font-size: 1.5rem; }
}

.user-name { margin: 10px 0 5px 0; font-family: 'Oswald'; text-transform: uppercase; letter-spacing: 1px; }
.user-role { background: #34495e; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase; color: #bdc3c7; }
.logout-container { display: flex; align-items: center; gap: 10px; cursor: pointer; color: #e74c3c; transition: 0.3s; }
.logout-container:hover { color: #ff6b6b; transform: scale(1.05); }
.logout-text { font-family: 'Oswald'; text-transform: uppercase; font-weight: bold; }
</style>