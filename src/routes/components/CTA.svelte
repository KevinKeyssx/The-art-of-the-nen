<script lang="ts">
    import NenCard from "$lib/components/cards/nen-card.svelte";
</script>


<div class="max-w-3xl mx-auto text-center mb-20 px-5 xl:px-0">
    <NenCard showGlow = { true } showAura = { true }>
        <div class="relative z-10">
            <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <div class="w-8 h-8 rounded-full bg-primary aura-pulse"></div>
            </div>

            <h2 class="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Descubre tu Tipo de Nen
            </h2>

            <p class="text-muted-foreground mb-8 max-w-lg mx-auto">
                Responde nuestro cuestionario de personalidad y descubre cual seria tu tipo de aura 
                si fueras un usuario de Nen en el mundo de Hunter x Hunter.
            </p>

            <a 
                href="/quiz" 
                class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 text-lg"
            >
                Comenzar el Test
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </a>
        </div>
    </NenCard>
</div>
