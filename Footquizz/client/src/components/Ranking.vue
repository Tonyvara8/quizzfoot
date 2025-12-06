<template>
  <div class="ranking-view">
    
    <div class="ranking-card">
        <div class="ranking-header">
            <h2>HALL OF FAME</h2>
        </div>

        <div class="ranking-list">
            <div class="ranking-row header-row">
                <span class="rank">#</span>
                <span class="name">Joueur</span>
                <span class="score">Score</span>
            </div>

            <div 
                v-for="(player, index) in ranking" 
                :key="index" 
                class="ranking-row"
                :class="{ 'top-1': index === 0, 'top-3': index < 3 }"
            >
                <span class="rank">
                    <i v-if="index === 0" class="fas fa-crown gold-icon"></i>
                    <span v-else>{{ index + 1 }}</span>
                </span>
                <span class="name">{{ player.username }}</span>
                <span class="score">{{ player.score }} pts</span>
            </div>

            <div v-if="ranking.length === 0" style="padding:20px; text-align:center;">
                Chargement...
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const ranking = ref([]);

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/ranking');
        ranking.value = res.data;
    } catch (e) {
        console.error("Erreur classement", e);
    }
});
</script>

<style scoped>
.ranking-view { display: flex; justify-content: center; align-items: center; min-height: 100%; padding: 20px; }

.ranking-card { 
    background: white; 
    color: #1e272e; 
    width: 100%; 
    max-width: 600px; 
    border-radius: 20px; 
    overflow: hidden; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.ranking-header { 
    background: #1e272e; 
    color: white; 
    padding: 30px; 
    text-align: center; 
    border-bottom: 5px solid #f1c40f; 
}
.ranking-header h2 { font-family: 'Oswald'; margin: 10px 0 0 0; letter-spacing: 2px; }

.ranking-list { padding: 0; }

.ranking-row { 
    display: flex; 
    justify-content: space-between; 
    padding: 15px 20px; 
    border-bottom: 1px solid #eee; 
    font-family: 'Poppins'; 
    font-weight: bold;
    align-items: center;
}

.header-row { background: #f1f2f6; color: #7f8c8d; font-size: 0.9rem; text-transform: uppercase; }

.rank { width: 40px; text-align: center; font-weight: bold; }
.name { flex-grow: 1; padding-left: 20px; }
.score { color: #2ecc71; font-family: 'Oswald'; font-size: 1.2rem; }

.top-1 { background: linear-gradient(to right, #fff, #fff9db); font-size: 1.1rem; border-left: 5px solid #f1c40f; }
.top-3 { color: #2c3e50; }

.gold-icon { color: #f1c40f; }
</style>