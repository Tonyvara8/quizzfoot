<template>
  <div class="quiz-container">
      
      <div class="match-header">
        <h2 class="section-title">MATCH DAY</h2>
        <div class="score-display">
            <i class="fas fa-star gold-icon"></i>
            <span>{{ score }} pts</span>
        </div>
      </div>
      
      <div v-if="isAdmin" class="admin-panel">
        <div class="admin-grid">
          <input v-model="newQ" placeholder="New Question...">
          <input v-model="newA" placeholder="Answer...">
          <button @click="addQuiz" class="btn-success">ADD</button>
        </div>
      </div>

      <div v-if="quizzes.length === 0" style="text-align:center; color: white;">
        <p>No matches scheduled.</p>
      </div>

      <div v-else class="carousel-area">
        
        <button class="nav-btn" @click="prev" :disabled="idx === 0">
            <i class="fas fa-chevron-left"></i>
        </button>

        <div class="quiz-card active-card">
            <div class="question-counter">Question {{ idx + 1 }} / {{ quizzes.length }}</div>
            <div class="question-text">{{ quizzes[idx].question }}</div>
            
            <div class="game-zone">
                <div class="input-action">
                    <input v-model="userAnswer" placeholder="Your answer..." class="game-input"
                        :disabled="dejaRepondu" @keyup.enter="verifier">
                    <button @click="verifier" class="shoot-btn" :disabled="dejaRepondu">SHOOT!</button>
                </div>
                
                <div v-if="message" class="feedback-msg" :class="messageClass">
                    {{ message }}
                </div>
            </div>

            <div class="answer-zone">
                <button v-if="!montrerReponse" @click="montrerReponse=true" class="reveal-btn">Reveal Answer</button>
                <div v-else class="the-answer">{{ quizzes[idx].answer }}</div>
            </div>
            
            <i v-if="isAdmin" class="fas fa-trash-alt delete-icon" @click="supprimer(quizzes[idx].id)"></i>
        </div>

        <button v-if="idx < quizzes.length - 1" class="nav-btn" @click="suivant">
            <i class="fas fa-chevron-right"></i>
        </button>
        
        <button v-else class="finish-btn" @click="finir">FINISH</button>

      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quizzes = ref([]);
const idx = ref(0);
const userAnswer = ref('');
const message = ref('');
const messageClass = ref('');
const dejaRepondu = ref(false);
const montrerReponse = ref(false);

const newQ = ref('');
const newA = ref('');
const isAdmin = ref(false);

const score = ref(0);
const pseudo = ref('');

onMounted(() => {
    if (localStorage.getItem('role') === 'admin') isAdmin.value = true;
    pseudo.value = localStorage.getItem('username');
    chargerQuiz();
});

async function chargerQuiz() {
    const res = await axios.get('http://localhost:3000/api/quizzes');
    quizzes.value = res.data;
}

async function verifier() {
    if (dejaRepondu.value) return;

    const bonneReponse = quizzes.value[idx.value].answer;
    
    if (userAnswer.value.toLowerCase() === bonneReponse.toLowerCase()) {
        message.value = 'GOAL! (+10 pts) ⚽';
        messageClass.value = 'feedback-correct';
        score.value += 10;
        
        await axios.put('http://localhost:3000/api/score', {
            username: pseudo.value,
            score: score.value
        });
    } else {
        message.value = 'MISS! ❌';
        messageClass.value = 'feedback-wrong';
    }
    dejaRepondu.value = true;
}

function suivant() {
    idx.value++;
    reset();
}

function prev() {
    idx.value--;
    reset();
}

function reset() {
    userAnswer.value = '';
    message.value = '';
    dejaRepondu.value = false;
    montrerReponse.value = false;
}

function finir() {
    alert('Match terminé ! Score : ' + score.value);
    window.location.reload();
}

async function addQuiz() {
    await axios.post('http://localhost:3000/api/quizzes', {
        question: newQ.value,
        answer: newA.value,
        role: localStorage.getItem('role')
    });
    newQ.value = '';
    newA.value = '';
    chargerQuiz();
}

async function supprimer(id) {
    if(confirm('Supprimer ?')) {
        await axios.delete('http://localhost:3000/api/quizzes/' + id);
        chargerQuiz();
    }
}
</script>

<style scoped>
.match-header { display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 20px; }

.section-title { text-align: center; color: white; margin: 0; }

.score-display { position: absolute; right: 0; background: #0f1519; color: #f1c40f; padding: 10px 20px; border-radius: 50px; font-family: 'Oswald'; font-size: 1.2rem; border: 2px solid #2ecc71; display: flex; align-items: center; gap: 10px; }

.carousel-area { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px; }

.active-card { background: white; width: 100%; max-width: 500px; padding: 20px; border-radius: 20px; text-align: center; position: relative; border-top: 5px solid #2ecc71; }

.nav-btn { background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }

.finish-btn { background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 30px; font-family: 'Oswald'; cursor: pointer; }

.game-zone { margin: 15px 0; }


.input-action { display: flex; gap: 5px; justify-content: center; }

.game-input { padding: 10px; border: 1px solid #ccc; border-radius: 5px; flex-grow: 1; }

.shoot-btn { background: #1e272e; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-family: 'Oswald'; }

.feedback-correct { color: green; font-weight: bold; margin-top: 5px; }

.feedback-wrong { color: red; font-weight: bold; margin-top: 5px; }

.answer-zone { margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 10px; }

.reveal-btn { background: #3498db; color: white; border: none; padding: 5px 15px; border-radius: 15px; cursor: pointer; }

.the-answer { font-size: 1.1rem; color: #27ae60; font-weight: bold; }

.delete-icon { position: absolute; bottom: 10px; right: 10px; cursor: pointer; color: #ccc; }

</style>