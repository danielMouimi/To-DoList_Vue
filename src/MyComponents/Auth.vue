<script setup>
import { signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router';

const router = useRouter();

const auth = useFirebaseAuth();
const user = useCurrentUser();



function login() {

    router.push("/login");

}

function logout() {
    signOut(auth).then(
        ()=>{
            console.log("cierra sesion");
            router.push("/");
    }).catch(
        (error)=>console.log("Error: "+error)
    );
}
function getUsernameFromEmail(email) {
  return email.split('@')[0];
}

</script>


<template>
  <div class="auth-actions">
    <span v-if="user" class="welcome">Hola, {{ user?.providerData[0]?.displayName || getUsernameFromEmail(user.email) }}</span>
    <button v-if="user" class="auth-button" @click="logout">Cerrar sesión</button>
    <button v-else class="auth-button" @click="login">Iniciar sesión</button>
  </div>
</template>

<style scoped>
.auth-actions { align-items:center; display:flex; gap:.6rem; }.welcome { color:var(--muted); font-size:.7rem; }.auth-button { background:var(--teal); border:0; border-radius:6px; color:#071318; font-size:.72rem; font-weight:700; padding:.55rem .8rem; }.auth-button:hover { background:#62f2c2; }
</style>
