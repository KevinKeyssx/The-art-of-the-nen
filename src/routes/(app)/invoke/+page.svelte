<script lang="ts">
    import { onMount }  from 'svelte';
    import { page }     from '$app/state';

    import {
        colorClasses,
        textColorClasses,
        borderColorClasses,
        nenColorVars
    }                           from '$lib/utils/nen-colors';
    import {
        playSound,
        SOUND_FILES
    }                           from '$lib/utils/player';
    import { NEN_TYPES }        from '$lib/data/nen-data';
    import { getFallbackHatsu } from '$lib/data/hatsu-data';
    import AuraFarm             from '$lib/components/loaders/aura-farm.svelte';
    import AuraButton           from '$lib/components/buttons/aura-button.svelte';
    import { goto }             from '$app/navigation';
    import PulseButton          from '$lib/components/buttons/pulse-button.svelte';
    import NenCard              from '$lib/components/cards/nen-card.svelte';
    import GenerateButton       from '$lib/components/buttons/generate-button.svelte';
    import RepeatIcon           from '$lib/components/icons/RepeatIcon.svelte';


    type PageState = 'form' | 'invoking' | 'revealed';


    let secondaryCode   = $state( 'EMI' );
    let primaryCode     = $state( 'INT' );
    let pageState       = $state<PageState>( 'form' );
    let userIdea        = $state( '' );
    let selectedTags    = $state<string[]>( [] );
    let retryCount      = $state( 0 );
    let loadingMessage  = $state( 'Canalizando tu Aura...' );
    let loading         = $state( false );
    let hatsuResult     = $state<any>( null );


    const primary   = $derived( NEN_TYPES[primaryCode as keyof typeof NEN_TYPES]     || NEN_TYPES.INT );
    const secondary = $derived( NEN_TYPES[secondaryCode as keyof typeof NEN_TYPES]   || NEN_TYPES.EMI );


    const combatTags = [
        { id: 'melee',      label: 'Combate cuerpo a cuerpo',   icon: '&#9876;' },
        { id: 'ranged',     label: 'Ataques a distancia',       icon: '&#127919;' },
        { id: 'defense',    label: 'Defensa y proteccion',      icon: '&#128737;' },
        { id: 'stealth',    label: 'Sigilo y espionaje',        icon: '&#128065;' },
        { id: 'support',    label: 'Soporte y curacion',        icon: '&#10084;' },
        { id: 'trap',       label: 'Trampas y emboscadas',      icon: '&#9881;' },
        { id: 'summon',     label: 'Invocaciones',              icon: '&#128126;' },
        { id: 'area',       label: 'Control de area',           icon: '&#127758;' },
        { id: 'speed',      label: 'Velocidad y agilidad',      icon: '&#9889;' },
        { id: 'mental',     label: 'Control mental',            icon: '&#129504;' },
    ];


    function toggleTag( tagId: string ) {
        selectedTags = selectedTags.includes( tagId )
            ? selectedTags.filter( t => t !== tagId )
            : [...selectedTags, tagId];

        if ( selectedTags.includes( tagId )) {
            playSound( SOUND_FILES.SELECTED, 0.1 );
        }
    }


    function resetHatsuState() {
        pageState       = 'form';
        hatsuResult     = null;
        selectedTags    = [];
        userIdea        = '';

        // Limpiar localStorage
        if ( typeof window !== 'undefined' ) {
            localStorage.removeItem( 'hatsuResult' );
            localStorage.removeItem( 'userIdea' );
            localStorage.removeItem( 'selectedTags' );
        }
    }

    // Función para invocar la habilidad usando Gemini AI
    async function generateAbility() {
        if ( !primary || !secondary ) return;

        loading         = true;
        pageState       = 'invoking';
        retryCount      = 0;
        loadingMessage  = 'Canalizando tu Aura...';

        try {
            // 1. Obtener las etiquetas seleccionadas
            const combatPreference = selectedTags
                .map( tagId => combatTags.find( t => t.id === tagId )?.label )
                .filter( Boolean )
                .join( ', ' );

            // 2. Crear un resumen de personalidad basado en los tipos
            const personalitySummary = `Tipo primario: ${primary.name} (${primary.description}). ` +
                `Tipo secundario: ${secondary.name} (${secondary.description}).`;

            // 3. Preparar los datos para enviar al API
            const requestData = {
                primaryType         : primary.name,
                secondaryType       : secondary.name,
                personalitySummary  : personalitySummary,
                combatPreference    : combatPreference || 'Sin preferencia específica',
                userInputIdea       : userIdea || 'Sorpréndeme con algo único',
            };

            // Función auxiliar para intentar generar con la API
            const tryGenerateWithAPI = async (): Promise<boolean> => {
                try {
                    const response = await fetch( '/api/generate-hatsu', {
                        method  : 'POST',
                        headers : { 'Content-Type': 'application/json' },
                        body    : JSON.stringify( requestData )
                    });

                    if ( response.ok ) {
                        hatsuResult = await response.json();
                        return true;
                    } else {
                        const errorData = await response.json();
                        return false;
                    }
                } catch ( error ) {
                    return false;
                }
            };

            // PRIMER INTENTO
            let success = await tryGenerateWithAPI();

            // SEGUNDO INTENTO (si el primero falló)
            if ( !success ) {
                retryCount = 1;
                loadingMessage = 'Tu flujo de aura es inestable en este momento. Los maestros de la asociación están analizando tu perfil, ten paciencia.';

                // Esperar un momento antes del segundo intento
                await new Promise( resolve => setTimeout( resolve, 3000 ));

                success = await tryGenerateWithAPI();
            }

            // FALLBACK HARDCODEADO (si ambos intentos fallaron)
            if ( !success ) {
                retryCount  = 2;
                hatsuResult = getFallbackHatsu( primary.name );
                success     = true;
            }

            // Si tenemos resultado (ya sea de API o fallback), mostrar
            if ( success && hatsuResult ) {
                // Cambiar al estado revelado con animaciones escalonadas
                setTimeout(() => {
                    pageState       = 'revealed';
                }, 2500 );
            } else {
                // Si aún así no hay resultado, volver al formulario
                pageState = 'form';
            }
        } catch ( error ) {
            pageState = 'form';
        } finally {
            loading = false;
        }
    }

    // Sincronizar el pageState con la URL
    $effect(() => {
        const currentState = page.url.searchParams.get( 'pageState' );

        if ( currentState !== pageState ) {
            const url = new URL( window.location.href );
            url.searchParams.set( 'pageState', pageState );
            goto( url.toString(), { replaceState: true, noScroll: true });
        }
    });

    // Guardar hatsuResult en localStorage cuando cambie
    $effect(() => {
        if ( typeof window !== 'undefined' && hatsuResult ) {
            localStorage.setItem( 'hatsuResult', JSON.stringify( hatsuResult ) );
        }
    });

    // Guardar userIdea en localStorage cuando cambie
    $effect(() => {
        if ( typeof window !== 'undefined' ) {
            localStorage.setItem( 'userIdea', userIdea );
        }
    });

    // Guardar selectedTags en localStorage cuando cambie
    $effect(() => {
        if ( typeof window !== 'undefined' ) {
            localStorage.setItem( 'selectedTags', JSON.stringify( selectedTags ) );
        }
    });


    onMount(() => {
        const params    = new URLSearchParams( window.location.search );
        primaryCode     = params.get( 'primary' ) || 'INT';
        secondaryCode   = params.get( 'secondary' ) || 'EMI';

        // Cargar datos desde localStorage
        const savedHatsu        = localStorage.getItem( 'hatsuResult' );
        const savedIdea         = localStorage.getItem( 'userIdea' );
        const savedTags         = localStorage.getItem( 'selectedTags' );
        const savedPageState    = params.get( 'pageState' ) as PageState;

        if ( savedHatsu ) {
            hatsuResult = JSON.parse( savedHatsu );
            // Si hay un hatsuResult guardado y el pageState es 'revealed', mostrar todo
            if ( savedPageState === 'revealed' ) {
                pageState = 'revealed';
            }
        }

        if ( savedIdea ) userIdea = savedIdea;
        if ( savedTags ) selectedTags = JSON.parse( savedTags );
    });
</script>


<svelte:head>
    <title>Invocar Habilidad Especial - Hunter x Hunter Nen</title>
    <meta name="description" content="Descubre cual seria tu habilidad especial Nen basada en tu tipo de aura." />
</svelte:head>


<div class="min-h-screen bg-background relative overflow-hidden">
    <!-- FORM STATE -->
    {#if pageState === 'form'}
        <div class="min-h-screen flex items-center justify-center px-4 py-20">
            <div class="max-w-2xl mx-auto w-full">
                <div class="text-center mb-10 animate-fade-in-up">
                    <!-- Animated aura icon -->
                    <div class="relative w-24 h-24 mx-auto mb-6">
                        <div class="absolute inset-0 rounded-full {colorClasses[primary.color]}/20 aura-pulse"></div>

                        <div class="absolute inset-3 rounded-full {colorClasses[primary.color]}/30 aura-pulse" style="animation-delay: 0.3s;"></div>

                        <div class="absolute inset-0 flex items-center justify-center">
                            <svg class="w-10 h-10 {textColorClasses[primary.color]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                    </div>

                    <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
                        Invoca tu <span class="{textColorClasses[primary.color]}">Habilidad Especial</span>
                    </h1>

                    <p class="text-muted-foreground max-w-lg mx-auto">
                        Basado en tu tipo principal <span class="{textColorClasses[primary.color]} font-medium">{primary.name}</span>
                        y tu secundario <span class="{textColorClasses[secondary.color]} font-medium">{secondary.name}</span>,
                        vamos a descubrir cual sería tu Hatsu único.
                    </p>
                </div>

                <!-- Type indicators -->
                <div class="flex items-center justify-center gap-4 mb-8 animate-fade-in-up" style="animation-delay: 0.1s;">
                    <div class="flex items-center gap-2 px-4 py-2 rounded-full {colorClasses[primary.color]}/10 border {borderColorClasses[primary.color]}">
                        <div class="w-3 h-3 rounded-full {colorClasses[primary.color]} aura-pulse"></div>
                        <span class="{textColorClasses[primary.color]} text-sm font-medium">{primary.name}</span>
                    </div>

                    <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>

                    <div class="flex items-center gap-2 px-4 py-2 rounded-full {colorClasses[secondary.color]}/10 border {borderColorClasses[secondary.color]}">
                        <div class="w-3 h-3 rounded-full {colorClasses[secondary.color]} aura-pulse"></div>
                        <span class="{textColorClasses[secondary.color]} text-sm font-medium">{secondary.name}</span>
                    </div>
                </div>

                <!-- Combat style tags -->
                <div class="mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">
                    <span class="block text-sm font-medium text-foreground mb-3">
                        Elige hasta 3 estilos de combate que te atraigan
                    </span>

                    <div class="flex flex-wrap gap-2">
                        {#each combatTags as tag}
                        {@const isSelected = selectedTags.includes(tag.id)}
                        <button
                            onclick={() => toggleTag(tag.id)}
                            class="px-3 py-2 rounded-lg text-sm border transition-all duration-300
                            {isSelected
                                ? colorClasses[primary.color] + '/20 ' + borderColorClasses[primary.color] + ' ' + textColorClasses[primary.color] + ' scale-105'
                                : 'bg-card border-border text-muted-foreground hover:border-muted-foreground/50'
                            }
                            {!isSelected && selectedTags.length >= 3 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}"
                            disabled={!isSelected && selectedTags.length >= 3}
                        >
                            <span class="flex items-center gap-1.5">
                                <span>{@html tag.icon}</span>

                                {tag.label}
                            </span>
                        </button>
                        {/each}
                    </div>
                </div>

                <!-- Textarea for ideas -->
                <div class="mb-8 animate-fade-in-up" style="animation-delay: 0.3s;">
                    <label for="idea" class="block text-sm font-medium text-foreground mb-3">
                        Tienes alguna idea de habilidad, estilo o reglas en mente? (Opcional)
                    </label>

                    <textarea
                        id="idea"
                        bind:value={userIdea}
                        placeholder="Ejemplo: Me gustaria una habilidad que me permita controlar las sombras, o algo relacionado con el fuego y la velocidad..."
                        rows={4}
                        class="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    ></textarea>
                </div>

                <!-- Submit button -->
                <div class="text-center animate-fade-in-up flex justify-center" style="animation-delay: 0.4s;">
                    <AuraButton
                        text="Invocar mi Habilidad Especial"
                        onclick={generateAbility}
                        primaryColor={primary.color}
                    />
                </div>
            </div>
        </div>
    {/if}

    <!-- INVOKING STATE -->
    {#if pageState === 'invoking'}
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center relative">
                <!-- Central energy orb with dynamic colors -->
                <div class="relative w-48 h-48 mx-auto mb-8">
                    <AuraFarm 
                        primaryColor={nenColorVars[primary.color]} 
                        secondaryColor={nenColorVars[secondary.color]}
                        size={1.5}
                    />
                </div>

                <h2 class="text-2xl font-bold text-foreground mb-2 max-w-3xl mx-auto text-center">{loadingMessage}</h2>

                <p class="{textColorClasses[primary.color]} text-lg">Tu Hatsu está tomando forma</p>

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
    {/if}

    <!-- REVEALED STATE -->
    {#if pageState === 'revealed' && hatsuResult}
        <div class="min-h-screen flex items-center justify-center px-4 py-20">
            <!-- Background glow -->
            <div
                class="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl transition-opacity duration-1000 {colorClasses[primary.color]}"
            ></div>

            <div class="max-w-3xl mx-auto w-full relative z-10">
                <!-- Phase 1: Ability Name + Kanji -->
                <div class="text-center mb-10 animate-slide-in-top animate-duration-1000 animate-delay-[50ms]">
                    <p class="text-sm {textColorClasses[primary.color]} mb-4 tracking-widest uppercase">Tu Hatsu ha sido revelado</p>

                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold {textColorClasses[primary.color]} mb-3" style="text-shadow: 0 0 40px {nenColorVars[primary.color]}, 0 0 80px {nenColorVars[primary.color]}40;">
                        { hatsuResult.name }
                    </h1>

                    <!-- Kanji Name -->
                    {#if hatsuResult.kanji_name}
                        <p class="text-2xl {textColorClasses[primary.color]}/70 mb-4 font-light">
                            {hatsuResult.kanji_name}
                        </p>
                    {/if}

                    <div class="flex items-center justify-center gap-3 mt-4">
                        <span class="px-3 py-1 text-xs rounded-full {colorClasses[primary.color]}/20 {textColorClasses[primary.color]} border {borderColorClasses[primary.color]}">
                            { primary.name }
                        </span>

                        <span class="text-muted-foreground">+</span>

                        <span class="px-3 py-1 text-xs rounded-full {colorClasses[secondary.color]}/20 {textColorClasses[secondary.color]} border {borderColorClasses[secondary.color]}">
                            { secondary.name }
                        </span>
                    </div>
                </div>

                <!-- Phase 2: Description -->
                <NenCard borderColor={primary.color} showGlow={true} class="mb-8 animate-delay-1000">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-1 h-6 rounded-full {colorClasses[primary.color]}"></div>
                        <h3 class="text-lg font-bold text-foreground">Descripción de la Habilidad</h3>
                    </div>

                    <p class="text-foreground/90 leading-relaxed text-base">
                        { hatsuResult.description }
                    </p>
                </NenCard>

                <!-- Phase 3: Combat Style -->
                <NenCard borderColor={secondary.color} showGlow={true} class="mb-8 animate-delay-2000">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-1 h-6 rounded-full {colorClasses[secondary.color]}"></div>
                        <h3 class="text-lg font-bold text-foreground">Estilo de Combate</h3>
                    </div>

                    <p class="text-foreground/90 leading-relaxed">
                        { hatsuResult.combat_style }
                    </p>
                </NenCard>

                <!-- Phase 4: Conditions and Vows -->
                <NenCard borderColor="nen-esp" showGlow={false} class="mb-8 animate-delay-3000">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-1 h-6 rounded-full bg-destructive"></div>
                        <h3 class="text-lg font-bold text-foreground">Condiciones y Juramentos</h3>
                    </div>

                    <div class="space-y-3">
                        {#each hatsuResult.conditions_and_vows as condition, index}
                            <div class="flex gap-3">
                                <span class="text-destructive font-bold text-sm mt-0.5">{index + 1}.</span>

                                <p class="text-foreground/90 leading-relaxed flex-1">
                                    { condition }
                                </p>
                            </div>
                        {/each}
                    </div>

                    <p class="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                        En el mundo del Nen, las restricciones más severas otorgan el mayor poder. Tus juramentos son el precio de tu fuerza.
                    </p>
                </NenCard>

                <!-- Phase 5: Usage Example -->
                <NenCard borderColor={primary.color} showGlow={false} class="mb-8 animate-delay-4000">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-1 h-6 rounded-full bg-primary"></div>

                        <h3 class="text-lg font-bold text-foreground">Ejemplo de Uso en Combate</h3>
                    </div>

                    <p class="text-foreground/90 leading-relaxed italic">
                        { hatsuResult.usage_example }
                    </p>
                </NenCard>

                <!-- Phase 6: Actions -->
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-down animate-duration-1000 animate-delay-5000">
                    <PulseButton
                        text    = "Repetir el Test"
                        onClick = { () => goto('/quiz?quizState=intro') }
                    >
                        <RepeatIcon />
                    </PulseButton>

                    <AuraButton
                        text            = "Invocar otra Habilidad"
                        onclick         = { resetHatsuState }
                        primaryColor    = { primary.color }
                    />

                    <GenerateButton
                        onclick = { resetHatsuState }
                        text    = "Explorar más sobre el Nen"
                    />
                </div>
            </div>
        </div>
    {/if}
</div>
