<template>
  <footer class="app-footer">
    <div class="footer-brand"><span class="brand-mark">✦</span><div><strong>Lumina <em>Focus</em></strong><small>Recordatorios para una mente más clara.</small></div></div>
    <div class="footer-author"><span>Desarrollado por</span><strong>Daniel Amin Mouimi Romero</strong></div>
    <a class="github-link" href="https://github.com/" target="_blank" rel="noopener noreferrer"><span class="github-icon">◆</span><span><small>Código disponible en</small><strong>GitHub ↗</strong></span></a>
  </footer>
</template>

<style scoped>
.app-footer{align-items:center;border-top:1px solid var(--line);display:flex;gap:2rem;justify-content:space-between;margin:3rem auto 0;max-width:1040px;padding:1.5rem 0;color:var(--muted)}.footer-brand,.github-link{align-items:center;display:flex;gap:.65rem}.brand-mark{align-items:center;background:var(--teal);border-radius:7px;color:#071318;display:inline-flex;height:1.7rem;justify-content:center;width:1.7rem}.footer-brand strong{color:var(--text);display:block;font-size:.78rem}.footer-brand em{color:var(--teal);font-style:normal}.footer-brand small,.footer-author span,.github-link small{display:block;font-size:.62rem}.footer-author{text-align:center}.footer-author strong{color:var(--text);display:block;font-size:.7rem;margin-top:.2rem}.github-link{border:1px solid var(--line);border-radius:7px;padding:.55rem .75rem;transition:.2s}.github-link:hover{border-color:var(--teal);color:var(--teal);transform:translateY(-2px)}.github-icon{color:var(--teal);font-size:.85rem}.github-link strong{color:var(--text);display:block;font-size:.72rem;margin-top:.15rem}.github-link:hover strong{color:var(--teal)}@media(max-width:650px){.app-footer{align-items:flex-start;flex-direction:column;gap:1.2rem}.footer-author{text-align:left}.github-link{align-self:stretch;justify-content:center}}
</style>
