<script lang="ts">
    import GenerateButton from '$lib/components/buttons/generate-button.svelte';


    let { startQuiz }: { startQuiz: () => void } = $props();
</script>


<div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-2xl mx-auto text-center animate-fade-in-up">
        <!-- Aura animation -->
        <div class="relative w-32 h-32 mx-auto mb-8">
            <div class="absolute inset-0 rounded-full bg-primary/20 aura-pulse"></div>
            <div class="absolute inset-4 rounded-full bg-primary/30 aura-pulse" style="animation-delay: 0.3s;"></div>
            <div class="absolute inset-8 rounded-full bg-primary/40 aura-pulse" style="animation-delay: 0.6s;"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-4xl font-bold text-primary">?</span>
            </div>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Descubre tu Tipo de <span class="text-primary">Nen</span>
        </h1>

        <p class="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Responde 7 preguntas sobre tu personalidad y descubre cual seria tu tipo de aura 
            en el mundo de Hunter x Hunter.
        </p>

        <div class="bg-amber-800/10 backdrop-blur-sm rounded-lg p-4 mt-4 mb-4 flex items-center gap-2 mx-auto max-w-lg border border-amber-600/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle text-amber-500"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
            <span class="text-sm text-zinc-200">Se reproducirá una música de fondo para ayudarte a concentrarte. No dudes en apagarlo si lo deseas.</span>
        </div>

        <div class="space-y-4 flex flex-col items-center">
            <GenerateButton
                text="Comenzar el Test"
                onclick={startQuiz}
            />

            <p class="text-sm text-muted-foreground">
                El test toma aproximadamente 2-3 minutos
            </p>
        </div>
    </div>
</div>
