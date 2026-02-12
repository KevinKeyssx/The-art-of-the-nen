<script lang="ts">
    import { goto } from "$app/navigation";

    import {
        borderColorClasses,
        colorClasses,
        nenColorVars,
        textColorClasses
    }                       from "$lib/utils/nen-colors";
    import {
        clearLocalStorage,
        LOCAL_STORAGE_KEYS,
        removeLocalStorage
    }                       from "$lib/utils/local-storage";
    import AuraButton       from "$lib/components/buttons/aura-button.svelte";
    import PulseButton      from "$lib/components/buttons/pulse-button.svelte";
    import NenCard          from "$lib/components/cards/nen-card.svelte";
    import RepeatIcon       from "$lib/components/icons/RepeatIcon.svelte";
    import ShareButton      from "$lib/components/buttons/share-button.svelte";
    import Share            from "$lib/components/Share.svelte";


    let {
        primary,
        secondary,
        hatsuResult,
        pageState = $bindable()
    } = $props();


    let showShareDialog = $state( false );

    // svelte-ignore state_referenced_locally
    const shareText         = `¡Si! Acabo de descubrir mi Hatsu: ${hatsuResult.name}. Descubre el tuyo en el mundo del Nen!`;
    const shareCardId       = 'hatsu-share-card';
    const toggleShareDialog = (): boolean => showShareDialog = !showShareDialog;


    function resetHatsuState(): void {
        pageState   = 'form';
        hatsuResult = null;

        // Limpiar localStorage
        removeLocalStorage( LOCAL_STORAGE_KEYS.NEN_HATSU_RESULT );
        removeLocalStorage( LOCAL_STORAGE_KEYS.NEN_HATSU_SELECTED );
        removeLocalStorage( LOCAL_STORAGE_KEYS.NEN_HATSU_IDEA );
    }


    function resetAllNenState(): void {
        clearLocalStorage();

        goto( '/quiz?quizState=intro' );
    }
</script>


<div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="max-w-4xl mx-auto w-full relative z-10">
        <div id={ shareCardId } class=" px-2 sm:px-8 md:px-18 space-y-4 pt-12 pb-2">
            <!-- Background glow -->
            <div
                class="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl transition-opacity duration-1000 {colorClasses[primary.color]}"
            ></div>

            <!-- Phase 1: Ability Name + Kanji -->
            <div class="text-center mb-10 ">
                <p class="text-sm {textColorClasses[primary.color]} mb-4 tracking-widest uppercase animate-fade-in-down animate-duration-2000">
                    Tu Hatsu ha sido revelado
                </p>

                <div class="relative inline-block">
                    <!-- Capa de glow/shadow de fondo -->
                    <h1
                        class="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-bold mb-3 animate-blurred-fade-in animate-duration-4000 {textColorClasses[primary.color]} blur-sm opacity-80"
                        style="text-shadow: 0 0 40px {nenColorVars[primary.color]}, 0 0 80px {nenColorVars[primary.color]}40;"
                    >
                        { hatsuResult.name }
                    </h1>

                    <!-- Capa de texto con gradiente -->
                    <h1
                        class="relative text-4xl sm:text-5xl md:text-6xl font-bold mb-3 animate-blurred-fade-in animate-duration-4000 text-transparent bg-clip-text"
                        style="background-image: linear-gradient(to right, {nenColorVars[primary.color]}, {nenColorVars[secondary.color]});"
                    >
                        { hatsuResult.name }
                    </h1>
                </div>

                <!-- Kanji Name -->
                {#if hatsuResult.kanji_name}
                    <p class="text-2xl {textColorClasses[primary.color]}/70 mb-4 font-light animate-blurred-fade-in animate-duration-3000">
                        {hatsuResult.kanji_name}
                    </p>
                {/if}

                <div class="flex items-center justify-center gap-3 mt-4 ">
                    <span class="animate-zoom-in animate-duration-1000 animate-delay-1000 px-3 py-1 text-xs rounded-full {colorClasses[primary.color]}/20 {textColorClasses[primary.color]} border {borderColorClasses[primary.color]}">
                        { primary.name }
                    </span>

                    <span class="text-muted-foreground animate-zoom-in animate-duration-500 animate-delay-1500">+</span>

                    <span class="animate-zoom-in animate-duration-1000 animate-delay-2000 px-3 py-1 text-xs rounded-full {colorClasses[secondary.color]}/20 {textColorClasses[secondary.color]} border {borderColorClasses[secondary.color]}">
                        { secondary.name }
                    </span>
                </div>
            </div>

            <!-- Phase 2: Description -->
            <NenCard borderColor={primary.color} showGlow={true} class="mb-8 animate-delay-3000">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-1 h-6 rounded-full {colorClasses[primary.color]}"></div>
                    <h3 class="text-lg font-bold text-foreground">Descripción de la Habilidad</h3>
                </div>

                <p class="text-foreground/90 leading-relaxed text-base">
                    { hatsuResult.description }
                </p>
            </NenCard>

            <!-- Phase 3: Combat Style -->
            <NenCard borderColor={secondary.color} showGlow={true} class="mb-8 animate-delay-4000">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-1 h-6 rounded-full {colorClasses[secondary.color]}"></div>
                    <h3 class="text-lg font-bold text-foreground">Estilo de Combate</h3>
                </div>

                <p class="text-foreground/90 leading-relaxed">
                    { hatsuResult.combat_style }
                </p>
            </NenCard>

            <!-- Phase 4: Conditions and Vows -->
            <NenCard borderColor="nen-esp" showGlow={false} class="mb-8 animate-delay-5000">
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
            <NenCard borderColor={primary.color} showGlow={false} class="mb-8 animate-delay-6000">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-1 h-6 rounded-full bg-primary"></div>

                    <h3 class="text-lg font-bold text-foreground">Ejemplo de Uso en Combate</h3>
                </div>

                <p class="text-foreground/90 leading-relaxed italic">
                    { hatsuResult.usage_example }
                </p>
            </NenCard>
        </div>

        <!-- Phase 6: Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-down animate-duration-1000 animate-delay-7000">
            <PulseButton
                onClick = { resetAllNenState }
                className = " w-60 md:w-32 lg:w-52"
            >
                <RepeatIcon />
                <span class="block sm:hidden lg:block">Repetir el Test</span>
            </PulseButton>

            <AuraButton
                text            = "Invocar otra Habilidad"
                onclick         = { resetHatsuState }
                primaryColor    = { primary.color }
            />

            <ShareButton
                onClick = { toggleShareDialog }
                text    = "Compartir Resultado"
            />
        </div>
    </div>
</div>


<Share
    { showShareDialog }
    { shareText }
    imageName       = { `hatsu-${hatsuResult.name.toLowerCase()}` }
    onclick         = { toggleShareDialog }
    shareElementId  = { shareCardId }
/>
