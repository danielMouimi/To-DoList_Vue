<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where } from 'firebase/firestore'
import Header from './header.vue'
import TaskList from './list.vue'
import Footer from './footer.vue'
import Count from './count.vue'

const db = useFirestore(); const user = useCurrentUser(); const router = useRouter()
const classifier = ref('pending'); const sortBy = ref('recent'); const notice = ref({ type: '', text: '' })
const classifiers = [{ id:'pending', label:'Pendientes' }, { id:'week', label:'Esta semana' }, { id:'overdue', label:'Vencidas' }, { id:'important', label:'Alta prioridad' }, { id:'completed', label:'Completadas' }]
const isAdmin = computed(() => user.value?.uid === 'gXn8HOEU7RcBmSd3Ah6FJKc41Ty1')
const remindersQuery = computed(() => isAdmin.value ? query(collection(db,'Recordatorios'), orderBy('name','asc')) : query(collection(db,'Recordatorios'), where('user','==',user.value?.uid || ''), orderBy('name','asc')))
const tasks = useCollection(remindersQuery)
const visibleTasks = computed(() => {
  const now = new Date(); const end = new Date(now); end.setDate(now.getDate() + (7 - now.getDay() || 7))
  const result = (tasks.value || []).filter((task) => {
    const due = task.dueAt ? new Date(task.dueAt) : null
    if (classifier.value === 'pending') return !task.done
    if (classifier.value === 'week') return due && due >= now && due <= end && !task.done
    if (classifier.value === 'overdue') return due && due < now && !task.done
    if (classifier.value === 'important') return task.priority === 2 && !task.done
    if (classifier.value === 'completed') return task.done
    return true
  })
  return [...result].sort((a,b) => sortBy.value === 'priority' ? (b.priority||0)-(a.priority||0) : sortBy.value === 'name' ? a.name.localeCompare(b.name,'es') : sortBy.value === 'oldest' ? (a.time||0)-(b.time||0) : (b.time||0)-(a.time||0))
})
const activeCount = computed(() => (tasks.value || []).filter((task) => !task.done).length)
const importantCount = computed(() => (tasks.value || []).filter((task) => task.priority === 2 && !task.done).length)
function goBack(){ if(window.history.length > 1) router.back(); else router.push('/') }
function showNotice(type,text){ notice.value={type,text}; window.setTimeout(()=>{notice.value={type:'',text:''}},3500) }
async function add(values){ try{ await addDoc(collection(db,'Recordatorios'),values); showNotice('success','Recordatorio creado correctamente.') }catch(error){ showNotice('error','No se ha podido crear el recordatorio.'); console.error(error) } }
async function removeOne(id){ try{ await deleteDoc(doc(db,'Recordatorios',id)); showNotice('success','Recordatorio eliminado.') }catch(error){ showNotice('error','No se ha podido eliminar el recordatorio.'); console.error(error) } }
async function clearCompleted(){ const completed=(tasks.value||[]).filter((task)=>task.done); try{ await Promise.all(completed.map((task)=>deleteDoc(doc(db,'Recordatorios',task.id)))); showNotice('success',completed.length?`${completed.length} recordatorios eliminados.`:'No hay recordatorios completados.') }catch(error){ showNotice('error','No se han podido eliminar todos los recordatorios.'); console.error(error) } }
async function check(id,done){ try{ await updateDoc(doc(db,'Recordatorios',id),{done}) }catch(error){ showNotice('error','No se ha podido actualizar el estado.'); console.error(error) } }
async function priority(id,value){ try{ await updateDoc(doc(db,'Recordatorios',id),{priority:value}); showNotice('success','Prioridad actualizada.') }catch(error){ showNotice('error','No se ha podido actualizar la prioridad.'); console.error(error) } }
async function dueDate(id,value){ try{ await updateDoc(doc(db,'Recordatorios',id),{dueAt:value||null}); showNotice('success',value?'Fecha de entrega actualizada.':'Fecha de entrega eliminada.') }catch(error){ showNotice('error','No se ha podido actualizar la fecha.'); console.error(error) } }
</script>

<template>
<main class="dashboard"><div class="dashboard-top"><button class="back-button" @click="goBack">← Volver atrás</button><span class="page-kicker">ESPACIO PERSONAL</span></div><Header @newContent="add" />
<section class="workspace"><div class="workspace-heading"><div><span class="eyebrow">TU CENTRO DE CONTROL</span><h2>Mis recordatorios</h2><p>Organiza tus pendientes y mantén el foco en lo importante.</p></div><div class="quick-stats"><span><b>{{ activeCount }}</b> activos</span><span><b>{{ importantCount }}</b> importantes</span></div></div><Count :list="tasks" @clearCompleted="clearCompleted" />
<div class="toolbar"><div class="classifier-title"><span>Mostrar:</span> <strong>{{ classifiers.find((item) => item.id === classifier)?.label }}</strong></div><label class="sort-box">Ordenar por <select v-model="sortBy"><option value="recent">Más recientes</option><option value="oldest">Más antiguos</option><option value="priority">Prioridad</option><option value="name">Nombre</option></select></label></div>
<nav class="task-filters" aria-label="Clasificar recordatorios"><button v-for="item in classifiers" :key="item.id" :class="{active:classifier===item.id}" @click="classifier=item.id">{{ item.label }}</button></nav><p v-if="notice.text" class="notice" :class="notice.type">{{ notice.text }}</p>
<div v-if="!visibleTasks.length" class="empty-state"><div class="empty-icon">✦</div><h3>No hay tareas en esta categoría</h3><p>Prueba otra clasificación o crea un nuevo recordatorio.</p><button v-if="classifier !== 'pending'" class="btn-ghost" @click="classifier='pending'">Ver pendientes</button></div><transition-group v-else name="fade" tag="div" class="note-list"><TaskList v-for="task in visibleTasks" :key="task.id" :task="task" @remove="removeOne" @check="check" @priority="priority" @due-date="dueDate" /></transition-group></section><Footer /></main>
</template>

<style>
.dashboard{min-height:calc(100vh - 70px);padding:1px 1rem 3rem}.dashboard-top{align-items:center;display:flex;justify-content:space-between;margin:1.5rem auto -1rem;max-width:980px}.back-button{background:transparent;border:1px solid var(--line);border-radius:6px;color:var(--muted);font-size:.72rem;padding:.55rem .8rem}.back-button:hover{border-color:var(--teal);color:var(--teal)}.page-kicker,.eyebrow{color:var(--teal);font-size:.6rem;font-weight:700;letter-spacing:.16em}.workspace{background:rgba(13,19,23,.72);border:1px solid var(--line);border-radius:10px;margin:2rem auto 0;max-width:1040px;padding:1.5rem}.workspace-heading{align-items:flex-end;display:flex;justify-content:space-between}.workspace-heading h2{font-size:1.5rem;margin:.5rem 0 .25rem}.workspace-heading p{color:var(--muted);font-size:.75rem;margin:0}.quick-stats{display:flex;gap:1rem}.quick-stats span{border-left:1px solid var(--line);color:var(--muted);font-size:.65rem;padding-left:1rem}.quick-stats b{color:var(--text);display:block;font-size:1.05rem}.toolbar{align-items:center;display:flex;justify-content:space-between;margin:1rem 0 .7rem}.classifier-title{color:var(--muted);font-size:.75rem}.classifier-title strong{color:var(--text);margin-left:.25rem}.sort-box{color:var(--muted);font-size:.7rem}.sort-box select{background:#151d21;border:1px solid var(--line);border-radius:5px;color:var(--text);margin-left:.35rem;padding:.55rem}.task-filters{display:flex;gap:.45rem;margin:0 0 1rem;overflow:auto;padding-bottom:.25rem}.task-filters button{background:transparent;border:1px solid var(--line);border-radius:5px;color:var(--muted);font-size:.7rem;padding:.55rem .8rem;white-space:nowrap}.task-filters button:hover,.task-filters button.active{background:rgba(24,211,154,.1);border-color:var(--teal);color:var(--teal)}.notice{border-radius:5px;font-size:.72rem;margin:.75rem 0;padding:.65rem .8rem}.notice.success{background:rgba(24,211,154,.1);color:var(--teal)}.notice.error{background:rgba(255,127,134,.1);color:var(--red)}.empty-state{border:1px dashed var(--line);border-radius:8px;margin:1rem 0;padding:3rem 1rem;text-align:center}.empty-icon{color:var(--teal);font-size:1.5rem}.empty-state h3{font-size:1rem;margin:.8rem 0 .3rem}.empty-state p{color:var(--muted);font-size:.75rem;margin:0 0 1rem}.fade-enter-active,.fade-leave-active{transition:opacity .25s,transform .25s}.fade-enter-from,.fade-leave-to{opacity:0;transform:translateY(-8px)}@media(max-width:650px){.workspace{padding:1rem}.workspace-heading{align-items:flex-start;flex-direction:column;gap:1rem}.quick-stats{width:100%}.toolbar{align-items:stretch;flex-direction:column;gap:.7rem}.sort-box select{width:calc(100% - 75px)}}
</style>
