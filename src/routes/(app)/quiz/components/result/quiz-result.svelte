<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    import {
        colorClasses,
        textColorClasses,
        borderColorClasses,
        nenColorVars
    }                           from '$lib/utils/nen-colors';
    import {
        getLocalStorage,
        LOCAL_STORAGE_KEYS
    }                           from '$lib/utils/local-storage';
    import PulseButton          from '$lib/components/buttons/pulse-button.svelte';
    import ShareButton          from '$lib/components/buttons/share-button.svelte';
    import AuraButton           from '$lib/components/buttons/aura-button.svelte';
    import NenCard              from '$lib/components/cards/nen-card.svelte';
    import RepeatIcon           from '$lib/components/icons/RepeatIcon.svelte';
    import Graphic              from './Graphic.svelte';
    import Share                from '$lib/components/Share.svelte';
    import type { NenResult }   from '$lib/models/nen';


    let {
        result,
        onRestart
    }: {
        result      : NenResult;
        onRestart   : () => void
    } = $props();


    let showShareDialog = $state( false );
    let invokeStatus    = $state( 'Invocar mi Habilidad Especial' );

    // svelte-ignore state_referenced_locally
    const shareText         = `¡Acabo de descubrir mi tipo de Nen! Soy ${result.primary.name} con ${result.secondary.name} secundario. 🔥✨⚡ ¿Cuál es el tuyo?`;
    const shareCardId       = 'nen-share-card';
    const toggleShareDialog = (): boolean => showShareDialog = !showShareDialog;


    onMount( () => {
        const status = getLocalStorage( LOCAL_STORAGE_KEYS.NEN_HATSU_RESULT )

        if ( status ) {
            invokeStatus = 'Ver mi Habilidad Especial';
        } else {
            invokeStatus = 'Invocar mi Habilidad Especial';
        }
    });

    function invokeHatsu(): void {
        const base = `/invoke?primary=${result.primary.code}&secondary=${result.secondary.code}`;

        if ( invokeStatus === 'Invocar mi Habilidad Especial' ) {
            goto( base );
        } else {
            goto( `${base}&pageState=revealed` );
        }
    }
</script>


<div class="min-h-screen flex items-center justify-center relative mt-12 sm:mt-0">
    <!-- Large background glow -->
    <div  class="max-w-4xl mx-auto w-full relative">
        <!-- !HTMLToImage -->
        <div id={ shareCardId } class="px-6 sm:px-8 md:px-18 space-y-6 pt-12 pb-6">
            <div class="text-center opacity-0 animate-fade-in-down animate-duration-1000">
                <h1 
                    class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text mb-2 px-0 sm:px-7 md:px-16 xl:px-0"
                    style="background-image: linear-gradient(to right, {nenColorVars[result.primary.color]}, {nenColorVars[result.secondary.color]});"
                >
                    Tu Tipo de Nen ha sido Revelado
                </h1>

                <p class="text-muted-foreground">Basado en tus respuestas, este es tu perfil de aura</p>
            </div>

            <NenCard
                borderColor = { result.primary.color }
                showGlow    = { true }
                showAura    = { true }
                animate     = { 'animate-blurred-fade-in' }
                delay       = { 'animate-delay-1000' }
                duration    = { 'animate-duration-3000' }
            >
                <div
                    class="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl transition-opacity duration-1000 {colorClasses[result.primary.color]}"
                ></div>

                <div class="flex items-center justify-center gap-2 mb-2">
                    <span class="px-3 py-1 text-sm font-medium rounded-full {colorClasses[result.primary.color]}/50 {textColorClasses[result.primary.color]}">
                        Tipo Principal
                    </span>
                </div>

                <h3
                    class="text-center text-2xl sm:text-5xl md:text-5xl font-bold {textColorClasses[result.primary.color]} mb-3"
                    style="text-shadow: 0 0 40px {nenColorVars[result.primary.color]}, 0 0 80px {nenColorVars[result.primary.color]}40;"
                >
                    { result.primary.name }
                </h3>

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
                    { result.primary.test.action }
                </p>

                <p class="text-center text-zinc-400 max-w-xl mx-auto mb-4 text-[13px]">
                    { result.primary.test.description }
                </p>

                <p class="text-center text-zinc-300 max-w-xl mx-auto mb-4">
                    { result.primary.longDescription }
                </p>

                <div class="flex flex-wrap justify-center gap-2">
                    {#each result.primary.characters as character}
                        <span class="px-3 py-1 text-sm rounded-full {colorClasses[result.primary.color]}/10 {textColorClasses[result.primary.color]} border {borderColorClasses[result.primary.color]}">
                            { character }
                        </span>
                    {/each}
                </div>
            </NenCard>

            <!-- Secondary Type -->
            <NenCard
                borderColor = { result.secondary.color }
                showGlow    = { false }
                class       = "animate-delay-3000"
                showAura    = { true }
            >
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
                            { result.secondary.name }
                        </h3>

                        <p class="text-sm text-muted-foreground">{ result.secondary.description }</p>
                    </div>
                </div>
            </NenCard>

            <!-- Score Breakdown (Radar Chart) -->
            <Graphic {result} />
        </div>

        <!-- Actions -->
        <div class="animate-fade-in-up animate-duration-1000 animate-delay-5000 mb-10">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-0 flex-wrap">
                <!-- Botón de repetir -->
                <PulseButton
                    onClick={onRestart}
                    className = "w-60 sm:w-32 lg:w-52"
                >
                    <RepeatIcon />

                    <span class="block sm:hidden lg:block">Repetir el Test</span>
                </PulseButton>

                <!-- Botón de invocar habilidad -->
                <AuraButton
                    text            = { invokeStatus }
                    onclick         = { invokeHatsu }
                    primaryColor    = { result.primary.color }
                />

                <!-- Botón de Compartir -->
                <ShareButton
                    onClick = { toggleShareDialog }
                    text    = "Compartir Resultado"
                />
            </div>
        </div>
    </div>
</div>

<Share
    { shareText }
    { showShareDialog }
    imageName       = { result.primary.name }
    onclick         = { toggleShareDialog }
    shareElementId  = { shareCardId }
/>
