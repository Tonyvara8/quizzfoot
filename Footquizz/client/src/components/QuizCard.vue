<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['quiz', 'isAdmin']);
const emit = defineEmits(['refresh']); 

const userAnswer = ref('');
const status = ref(null); 

const verify = () => {
    
    if (userAnswer.value.toLowerCase() === props.quiz.answer.toLowerCase()) {
        status.value = 'correct';
    } else {
        status.value = 'wrong';
    }
}

const deleteQuiz = async () => {
    if(confirm("Red Card? T'es sûr de supprimer ?")) {
        await axios.delete(`http://localhost:3000/api/quizzes/${props.quiz.id}`);
        emit('refresh');
    }
}

const editQuiz = async () => {
    const newQ = prompt("Nouvelle question ?", props.quiz.question);
    const newA = prompt("Nouvelle réponse ?", props.quiz.answer);
    
    if (newQ && newA) {
        await axios.put(`http://localhost:3000/api/quizzes/${props.quiz.id}`, {
            question: newQ, answer: newA
        });
        emit('refresh');
    }
}
</script>

<template>
    <div class="quiz-card">
        <div class="question-text">
            <i class="far fa-futbol"></i> {{ quiz.question }}
        </div>

        <div v-if="!status">
            <div class="quiz-input-group" style="display:flex;">
                <input v-model="userAnswer" class="quiz-input" placeholder="Your answer...">
                <button @click="verify" class="check-btn">SHOOT!</button>
            </div>
        </div>

        <div v-if="status === 'correct'" class="feedback-msg feedback-correct">
            GOAL! ⚽<br>Bien joué!
        </div>

        <div v-if="status === 'wrong'" class="feedback-msg feedback-wrong">
            MISS! ❌<br>Réponse : {{ quiz.answer }}
            <br>
            <button @click="status = null; userAnswer = ''" style="color:black; margin-top:5px;">Rejouer</button>
        </div>

        <div v-if="isAdmin" class="admin-controls-icons">
            <i class="fas fa-edit edit-icon" @click="editQuiz"></i>
            <i class="fas fa-trash-alt delete-icon" @click="deleteQuiz"></i>
        </div>
    </div>
</template>