<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['list']);
const emit = defineEmits(['clearCompleted']);

const clearCompletedTasks = () => {
  emit('clearCompleted');
};
</script>

<template>
  <div class="content">
    <p><strong>{{ props.list.filter(item => item.done).length }}</strong> de {{ props.list.length }} tareas completadas</p>
    <!-- Botón con estilo de texto -->
    <button class="clear-completed-btn" @click="clearCompletedTasks">
      Limpiar completadas
    </button>
  </div>
</template>

<style scoped>
.content {
   align-items:center; background:transparent; color:var(--muted); display:flex; font-size:.75rem; justify-content:space-between; margin:1rem auto; max-width:980px; padding:0 1rem;
}

.clear-completed-btn {
  background: none;
  border: none;
  color: var(--red);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  margin-left: 10px;
}

.clear-completed-btn:hover {
  text-decoration: underline;
  color: darkred;
}

</style>
