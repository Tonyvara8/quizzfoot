<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['login-success']);
 
const username = ref('');
const password = ref('');

const login = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            username: username.value,
            password: password.value
        });

        if (response.data.success) {
            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('user_info', JSON.stringify(response.data.user));
            
            emit('login-success');
        }
    } catch (error) {
        alert("Mauvais mot de passe ou pseudo !");
    }
};
</script>

<template>
    <div class="main-card">
        <div class="card-header">
            <i class="fas fa-trophy fa-3x gold-icon"></i>
            <h1>KICK OFF</h1>
            <p>Creat account/p>
        </div>
        
        <div class="input-group">
            <i class="fas fa-user"></i>
            <input v-model="username" type="text" placeholder="Player Name (admin/admin)">
        </div>
        
        <div class="input-group">
            <i class="fas fa-lock"></i>
            <input v-model="password" type="password" placeholder="Password">
        </div>
        
        <button @click="login" class="btn-primary">ENTER PITCH</button>
    </div>
</template>