<script setup>
import { ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GithubAuthProvider} from "firebase/auth";

const router = useRouter()

const auth = useFirebaseAuth()
const googleAuthProvider = new GoogleAuthProvider()
const user = useCurrentUser()

const register = ref(false)
const email = ref('')
const password = ref('')
const password2 = ref('')
const errors = ref([]);
const loading = ref(false)

// Extraer el nombre de usuario del correo electrónico


function toggleRegister() {
  errors.value = []
  register.value = !register.value
}

function loginWithGoogle() {
  errors.value = []
  signInWithPopup(auth, googleAuthProvider)
    .then(() => {
      console.log('Autenticación correcta')
      router.push('/Recordatorios')
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function logout() {
  signOut(auth)
    .then(() => {
      console.log('Cierre de sesión exitoso')
      router.push('/')
    })
    .catch((error) => console.error('Error:', error))
}

function handleFormSubmit() {
  errors.value = []
  loading.value = true
  if (register.value) {
    // Registro
    if (password.value === password2.value) {
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          console.log('Usuario registrado correctamente');
          router.push('/Recordatorios');
        })
        .catch((error) => {
          console.error('Error al registrar:', error.message);
          errors.value.push(error.message);
          loading.value = false;
        })
    } else {
      console.error('Las contraseñas no coinciden');
      errors.value.push('Las contraseñas no coinciden');
      loading.value = false;

    }
  } else {
    // Inicio de sesión
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        console.log('Inicio de sesión exitoso')
        router.push('/Recordatorios')
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error.message);
        errors.value.push(error.message);
        loading.value = false;
      })
  }
}


const provider = new GithubAuthProvider();
function loginWithGithub() {
  signInWithPopup(auth, provider).then(() => 
  router.push('/Recordatorios')
  ).catch((error) => {
    console.error('Error en el inicio de sesión con GitHub:', error);
    errors.value.push('No se pudo iniciar sesión con GitHub.');
  })
}






</script>

<template>
  <div class="form-container">
    <div>
      <form @submit.prevent="handleFormSubmit" class="auth-form">
        <label for="email">Email:</label>
        <input
          v-model="email"
          name="email"
          type="email"
          placeholder="ejemplo@algoMas.algo"
          required
        />

        <label for="password">Contraseña:</label>
        <input
          v-model="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          required
        />

        <div v-if="register">
          <label for="password2">Repite la contraseña:</label>
          <input
            v-model="password2"
            name="password2"
            type="password"
            placeholder="Repite la contraseña"
            required
          />
        </div>

        <p v-for="err in errors" class="error-message">{{ err }}</p>

        <button type="submit" class="primary-button">
          {{ register ? "Registrarme" : "Iniciar sesión" }}
        </button>
        <button type="button" @click="toggleRegister" class="primary-button">
          {{ register ? "Ya tengo cuenta" : "Registrarme" }}
        </button>
      </form>

      <div class="actions">

        <button @click="loginWithGoogle" class="secondary-button">
          Iniciar sesión con Google
        </button>
        <button @click="loginWithGithub" class="secondary-button">
          Iniciar sesión con Github
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: flex-start; /* Alineación a la izquierda */
  align-items: center;
  min-height: 100vh;
  background-color: #1e1e1e; /* Fondo oscuro */
  padding: 2em;
}

.auth-form {
  background: #2c2c2c; /* Fondo más oscuro para el formulario */
  border-radius: 8px;
  padding: 2em;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  color: #f5f5f5; /* Texto claro */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.auth-form label {
  font-weight: bold;
  margin-bottom: 0.5em;
}

.auth-form input {
  padding: 0.75em;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #3a3a3a;
  color: white;
  font-size: 1em;
  outline: none;
  transition: border-color 0.3s ease;
}

.auth-form input:focus {
  border-color: #007bff;
}

.primary-button {
  background-color: #0056b3; /* Azul oscuro */
  color: white;
  padding: 0.75em;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1em;
}

.primary-button:hover {
  background-color: #004080; /* Azul más oscuro */
}

.secondary-button {
  background-color: #444; /* Gris oscuro */
  color: white;
  padding: 0.75em;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  background-color: #333; /* Gris más intenso */
}

.link-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1em;
  padding: 0;
}

.link-button:hover {
  color: #0056b3;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.9em;
}

.actions {
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-start; /* Alineación a la izquierda */
}
</style>
<style scoped>
.form-container { align-items:center; background:transparent; display:flex; justify-content:center; min-height:calc(100vh - 80px); padding:2rem 1rem; }.auth-form { background:rgba(21,29,33,.95); border:1px solid var(--line); border-radius:10px; box-shadow:0 20px 50px rgba(0,0,0,.3); gap:.65rem; max-width:420px; padding:2rem; }.auth-form label { color:var(--muted); font-size:.75rem; }.auth-form input { background:#0d1317; border:1px solid var(--line); border-radius:6px; color:var(--text); padding:.75rem; }.auth-form input:focus { border-color:var(--teal); }.primary-button { background:var(--teal); color:#071318; font-weight:700; }.primary-button:hover { background:#62f2c2; }.secondary-button { background:rgba(255,255,255,.04); border:1px solid var(--line); color:var(--text); }.secondary-button:hover { background:var(--panel-soft); }.error-message { color:var(--red); font-size:.72rem; }.actions { align-items:stretch; }
</style>
