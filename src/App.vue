<script setup>
import Auth from './MyComponents/Auth.vue'
</script>

<template>
  <div class="app-shell">
    <nav class="topbar" aria-label="Navegación principal">
      <RouterLink class="brand" to="/"><span class="brand-mark">✦</span><span>Lumina <em>Focus</em></span></RouterLink>
      <div class="nav-links"><RouterLink to="/">Inicio</RouterLink><RouterLink to="/Recordatorios">Recordatorios</RouterLink><RouterLink to="/#como-funciona">Cómo funciona</RouterLink><RouterLink to="/#planes">Planes</RouterLink></div>
      <div class="nav-actions"><Auth /><span class="user-dot" aria-hidden="true">●</span></div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; }
.topbar { align-items: center; background: rgba(13,19,23,.92); border-bottom: 1px solid var(--line); display: flex; gap: 2rem; justify-content: space-between; padding: 1rem clamp(1rem,4vw,4.5rem); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(18px); }
.brand { align-items: center; color: var(--text); display: flex; font-size: 1.05rem; font-weight: 750; gap: .6rem; white-space: nowrap; }.brand em { color: var(--teal); font-style: normal; }.brand-mark { align-items: center; background: var(--teal); border-radius: 8px; color: #071318; display: inline-flex; height: 1.65rem; justify-content: center; width: 1.65rem; }
.nav-links { display: flex; gap: clamp(.9rem,2vw,2rem); }.nav-links a { color: var(--muted); font-size: .78rem; font-weight: 600; }.nav-links a:hover, .nav-links .router-link-active { color: var(--teal); }.nav-actions { align-items: center; display: flex; gap: .75rem; }.user-dot { color: var(--teal); font-size: .7rem; }
@media (max-width: 800px) { .nav-links { display: none; }.topbar { padding-inline: 1rem; } }
</style>
