<script setup>
import { ref, defineEmits } from 'vue'
import { useCurrentUser } from 'vuefire'

const emit = defineEmits(['newContent'])
const content = ref(''); const priority = ref(1); const dueAt = ref(''); const user = useCurrentUser()
function newC(){ if(!content.value.trim() || !user.value) return; emit('newContent',{name:content.value.trim(),priority:priority.value,time:Date.now(),dueAt:dueAt.value || null,done:false,user:user.value.uid}); content.value=''; dueAt.value='' }
</script>

<template>
  <section class="quick-add" aria-labelledby="quick-add-title">
    <div class="quick-copy"><span class="eyebrow">CAPTURA RÁPIDA</span><h1 id="quick-add-title">Añade un recordatorio</h1><p>Escribe una tarea, define su importancia y decide cuándo quieres tenerla lista.</p><RouterLink class="focus-shortcut" to="/focus">✦ Ver Focus Premium</RouterLink></div>
    <div class="quick-form">
      <label class="task-field"><span class="field-label">¿Qué necesitas recordar?</span><input v-model="content" placeholder="Ej. Preparar la presentación del lunes..." @keyup.enter="newC"/><small>Pulsa Enter o utiliza el botón Añadir.</small></label>
      <div class="form-options">
        <label class="option-field"><span class="field-label">Prioridad</span><span class="field-help">¿Qué importancia tiene?</span><select v-model="priority" aria-label="Seleccionar prioridad"><option :value="0">Baja</option><option :value="1">Normal</option><option :value="2">Alta</option></select></label>
        <label class="option-field"><span class="field-label">Fecha de entrega</span><span class="field-help">¿Cuándo debe estar lista?</span><input v-model="dueAt" type="datetime-local" aria-label="Seleccionar fecha de entrega"/></label>
        <button class="btn-primary add-button" @click="newC">Añadir tarea <span>↗</span></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quick-add{background:linear-gradient(135deg,#18262a,#11191d);border:1px solid rgba(24,211,154,.2);border-radius:12px;box-shadow:0 16px 35px rgba(0,0,0,.18);display:grid;gap:2.5rem;grid-template-columns:minmax(210px,.75fr) minmax(0,1.4fr);margin:3rem auto 1.25rem;max-width:980px;padding:1.75rem}.eyebrow{color:var(--teal);font-size:.6rem;font-weight:700;letter-spacing:.15em}.quick-copy h1{font-size:1.5rem;margin:.55rem 0 .5rem}.quick-copy p{color:var(--muted);font-size:.76rem;line-height:1.6;margin:0 0 1.1rem}.focus-shortcut{color:var(--teal);font-size:.68rem;font-weight:600}.focus-shortcut:hover{text-decoration:underline}.quick-form{display:flex;flex-direction:column;gap:1rem}.task-field,.option-field{display:flex;flex-direction:column}.field-label{color:var(--text);font-size:.72rem;font-weight:700}.field-help,.task-field small{color:var(--muted);font-size:.62rem;margin-top:.2rem}.task-field input,.option-field input,.option-field select{background:#0b1215;border:1px solid #31464a;border-radius:7px;color:var(--text);margin-top:.45rem;min-height:2.5rem;outline:0;padding:.7rem .8rem;width:100%}.task-field input::placeholder{color:#667b80}.task-field input:focus,.option-field input:focus,.option-field select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(24,211,154,.1)}.form-options{align-items:end;display:grid;gap:.7rem;grid-template-columns:1fr 1.25fr auto}.add-button{min-height:2.5rem;white-space:nowrap}.add-button span{margin-left:.25rem}.option-field select{appearance:auto}.option-field input::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.65}@media(max-width:780px){.quick-add{gap:1.5rem;grid-template-columns:1fr}.form-options{grid-template-columns:1fr 1fr}.add-button{grid-column:1/-1}}@media(max-width:480px){.quick-add{padding:1.25rem}.form-options{grid-template-columns:1fr}}
</style>
