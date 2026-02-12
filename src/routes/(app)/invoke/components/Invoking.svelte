<script lang="ts">
    import { onDestroy } from "svelte";

    import {
        colorClasses,
        nenColorVars,
        textColorClasses
    }               from "$lib/utils/nen-colors";
    import AuraFarm from "$lib/components/loaders/aura-farm.svelte";


    let {
        primary,
        secondary,
        loadingMessage = $bindable(),
        errorMessage
    } = $props();

    const LOADING_HATSU_MESSAGES = [
        "Buscando una forma que se adapte a tu voluntad...",
        "Forjando el nombre de tu técnica en los registros de la Asociación...",
        "Calculando el equilibrio entre poder y restricciones...",
        "Estableciendo los Votos y Limitaciones para potenciar el efecto...",
        "Tu aura está tomando una forma nunca antes vista...",
        "Extrayendo el concepto de tus deseos más profundos...",
        "Afilando el estilo de combate que definirá tu leyenda...",
        "Traduciendo la esencia de tu poder al lenguaje del alma...",
        "Verificando que las condiciones de activación sean letales...",
        "Tu Hatsu está manifestándose lentamente... ¡Prepárate!"
    ];

    let messageIndex = $state(0);

    // Cambiar el mensaje cada 5 segundos
    setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_HATSU_MESSAGES.length;
        loadingMessage = LOADING_HATSU_MESSAGES[messageIndex];
    }, 5000);

    onDestroy(() => {
        clearInterval(  messageIndex);
    });
</script>


<div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center relative">
        <!-- Central energy orb with dynamic colors -->
        <div class="relative w-48 h-48 mx-auto mb-8 animate-blurred-fade-in animate-duration-2000">
            <AuraFarm 
                primaryColor    = { nenColorVars[primary.color]}  
                secondaryColor  = { nenColorVars[secondary.color] }
                size            = { 1.5 }
            />
        </div>

        <h2 class="text-2xl font-bold text-foreground mb-2 max-w-3xl mx-auto text-center animate-duration-2000 animate-pulse">{loadingMessage}</h2>

        <p class="{textColorClasses[primary.color]} text-lg">{ errorMessage }</p>

        <!-- Loading dots -->
        <div class="flex items-center justify-center gap-2 mt-6">
            {#each [0, 1, 2, 3, 4] as i}
                <div
                    class="w-2 h-2 rounded-full {colorClasses[primary.color]}"
                    style="animation: aura-pulse 1s ease-in-out infinite; animation-delay: {i * 0.15}s;"
                ></div>
            {/each}
        </div>
    </div>
</div>
