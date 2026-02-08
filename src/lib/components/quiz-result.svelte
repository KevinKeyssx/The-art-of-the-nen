<script lang="ts">
    import { onMount }          from 'svelte';
    import type { NEN_TYPES }   from '$lib/data/nen-data';

    type NenType = ( typeof NEN_TYPES )[keyof typeof NEN_TYPES];

    type Result = {
        primary         : NenType;
        secondary       : NenType;
        scores          : Record<string, number>;
        sortedScores    : [string, number][];
    };

    let { result, onRestart }: { result: Result; onRestart: () => void } = $props();

    let showContent     = $state( false );
    let showPrimary     = $state( false );
    let showSecondary   = $state( false );
    let showDetails     = $state( false );

    const colorClasses: Record<string, string> = {
        'nen-int': 'bg-nen-int',
        'nen-tra': 'bg-nen-tra',
        'nen-mat': 'bg-nen-mat',
        'nen-esp': 'bg-nen-esp',
        'nen-man': 'bg-nen-man',
        'nen-emi': 'bg-nen-emi'
    };

    const textColorClasses: Record<string, string> = {
        'nen-int': 'text-nen-int',
        'nen-tra': 'text-nen-tra',
        'nen-mat': 'text-nen-mat',
        'nen-esp': 'text-nen-esp',
        'nen-man': 'text-nen-man',
        'nen-emi': 'text-nen-emi'
    };

    const glowClasses: Record<string, string> = {
        'nen-int': 'glow-nen-int',
        'nen-tra': 'glow-nen-tra',
        'nen-mat': 'glow-nen-mat',
        'nen-esp': 'glow-nen-esp',
        'nen-man': 'glow-nen-man',
        'nen-emi': 'glow-nen-emi'
    };

    const borderColorClasses: Record<string, string> = {
        'nen-int': 'border-nen-int/50',
        'nen-tra': 'border-nen-tra/50',
        'nen-mat': 'border-nen-mat/50',
        'nen-esp': 'border-nen-esp/50',
        'nen-man': 'border-nen-man/50',
        'nen-emi': 'border-nen-emi/50'
    };

    const nenColorVars: Record<string, string> = {
        'nen-int': 'hsl(45 100% 50%)',
        'nen-tra': 'hsl(280 80% 60%)',
        'nen-mat': 'hsl(200 90% 55%)',
        'nen-esp': 'hsl(330 85% 55%)',
        'nen-man': 'hsl(140 70% 45%)',
        'nen-emi': 'hsl(25 95% 55%)'
    };

    onMount(() => {
        // Staggered reveal
        setTimeout( () => showContent = true, 200 );
        setTimeout( () => showPrimary = true, 800 );
        setTimeout( () => showSecondary = true, 1500 );
        setTimeout( () => showDetails = true, 2200 );
    });
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-20 relative">
    <!-- Large background glow -->
    {#if showPrimary}
        <div 
            class="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl transition-opacity duration-1000 {colorClasses[result.primary.color]}"
        ></div>
    {/if}

    <div class="max-w-3xl mx-auto w-full relative z-10">
        {#if showContent}
            <div class="text-center mb-8 animate-fade-in-up">
                <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">Tu Tipo de Nen ha sido Revelado</h1>

                <!-- <p class="text-muted-foreground">Basado en tus respuestas, este es tu perfil de aura</p> -->
            </div>
        {/if}

        <!-- Primary Type -->
        {#if showPrimary}
            <div class="mb-8 animate-reveal">
                <div class="p-8 rounded-2xl bg-card border {borderColorClasses[result.primary.color]} {glowClasses[result.primary.color]} relative overflow-hidden">
                    <!-- Inner glow -->
                    <div class="absolute inset-0 {colorClasses[result.primary.color]}/5"></div>

                    <div class="relative z-10">
                        <div class="flex items-center justify-center gap-2 mb-4">
                            <span class="px-3 py-1 text-sm font-medium rounded-full {colorClasses[result.primary.color]}/20 {textColorClasses[result.primary.color]}">
                                Tipo Principal
                            </span>
                        </div>

                        <!-- <div class="flex flex-col items-center mb-6"> -->
                            <!-- <div class="w-24 h-24 rounded-full {colorClasses[result.primary.color]}/30 flex items-center justify-center mb-4 relative">
                                <div class="absolute inset-0 rounded-full {colorClasses[result.primary.color]}/20 aura-pulse"></div>
                                <div class="w-16 h-16 rounded-full {colorClasses[result.primary.color]} aura-pulse"></div>
                            </div> -->

                            <h2 class="text-3xl text-center mb-4 sm:text-4xl font-bold {textColorClasses[result.primary.color]} mb-2">
                                {result.primary.name}
                            </h2>
                            <!-- <p class="text-sm text-muted-foreground">{result.primary.fullName}</p> -->
                        <!-- </div> -->

                        <video 
                            src="/videos/{result.primary.name}.mp4" 
                            autoplay 
                            loop 
                            muted 
                            playsinline
                            class="rounded-lg shadow-lg mx-auto mb-6 max-w-xs w-full"
                        >
                            Tu navegador no soporta videos.
                        </video>

                        <p class="text-center text-zinc-200 max-w-xl mx-auto mb-2">
                            {result.primary.test.action}
                        </p>

                        <p class="text-center text-zinc-400 max-w-xl mx-auto mb-4 text-[13px]">
                            { result.primary.test.description }
                        </p>

                        <p class="text-center text-zinc-300 max-w-xl mx-auto">
                            {result.primary.longDescription}
                        </p>

                        <!-- <div class="flex flex-wrap justify-center gap-2">
                            {#each result.primary.characters as character}
                                <span class="px-3 py-1 text-sm rounded-full {colorClasses[result.primary.color]}/10 {textColorClasses[result.primary.color]} border {borderColorClasses[result.primary.color]}">
                                    {character}
                                </span>
                            {/each}
                        </div> -->
                    </div>
                </div>
            </div>
        {/if}
        
        <!-- Secondary Type -->
        {#if showSecondary}
            <div class="mb-8 animate-fade-in-up">
                <div class="p-6 rounded-xl bg-card border {borderColorClasses[result.secondary.color]} relative overflow-hidden">
                    <div class="relative z-10">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-full {colorClasses[result.secondary.color]}/20 flex items-center justify-center shrink-0">
                                <div class="w-10 h-10 rounded-full {colorClasses[result.secondary.color]} aura-pulse"></div>
                            </div>

                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="px-2 py-0.5 text-xs font-medium rounded-full {colorClasses[result.secondary.color]}/20 {textColorClasses[result.secondary.color]}">
                                        Tipo Secundario
                                    </span>
                                </div>

                                <h3 class="text-xl font-bold {textColorClasses[result.secondary.color]}">
                                    {result.secondary.name}
                                </h3>

                                <p class="text-sm text-muted-foreground">{result.secondary.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Score Breakdown -->
        {#if showDetails}
            <!-- <div class="mb-8 animate-fade-in-up">
                <div class="p-6 rounded-xl bg-card border border-border">
                    <h3 class="text-lg font-bold text-foreground mb-4">Distribucion de tu Aura</h3>

                    <div class="space-y-3">
                        {#each result.sortedScores as [code, score], index}
                            {@const maxScore = result.sortedScores[0][1]}
                            {@const percentage = maxScore > 0 ? (score / 7) * 100 : 0}
                            {@const nenType = code as 'INT' | 'TRA' | 'MAT' | 'ESP' | 'MAN' | 'EMI'}
                            {@const colorKey = nenType === 'INT' ? 'nen-int' : nenType === 'TRA' ? 'nen-tra' : nenType === 'MAT' ? 'nen-mat' : nenType === 'ESP' ? 'nen-esp' : nenType === 'MAN' ? 'nen-man' : 'nen-emi'}

                            <div class="flex items-center gap-3">
                                <span class="w-24 text-sm text-muted-foreground">
                                    {nenType === 'INT' ? 'Intensificacion' : nenType === 'TRA' ? 'Transmutacion' : nenType === 'MAT' ? 'Materializacion' : nenType === 'ESP' ? 'Especializacion' : nenType === 'MAN' ? 'Manipulacion' : 'Emision'}
                                </span>

                                <div class="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        class="h-full {colorClasses[colorKey]} rounded-full transition-all duration-1000 ease-out"
                                        style="width: {percentage}%; animation-delay: {index * 0.1}s;"
                                    ></div>
                                </div>

                                <span class="w-8 text-sm font-medium {textColorClasses[colorKey]}">{score}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div> -->

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up flex-wrap">
                <button
                    onclick={onRestart}
                    class="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-card transition-all hover:scale-105"
                >
                    Repetir el Test
                </button>

                <a
                    href="/"
                    class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105"
                >
                    Explorar mas sobre el Nen
                </a>

                <a
                    href="/invoke?primary={result.primary.code}&secondary={result.secondary.code}"
                    class="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 relative overflow-hidden group border {borderColorClasses[result.primary.color]}"
                    style="background: linear-gradient(135deg, {nenColorVars[result.primary.color]}22, {nenColorVars[result.secondary.color]}22);"
                >
                    <span class="relative z-10 {textColorClasses[result.primary.color]} flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>

                        Invocar mi Habilidad Especial
                    </span>
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style="background: linear-gradient(135deg, {nenColorVars[result.primary.color]}33, {nenColorVars[result.secondary.color]}33);"></div>
                </a>
            </div>
        {/if}
    </div>
</div>
