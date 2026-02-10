<script lang="ts">
    import { onMount }  from 'svelte';
    import { page }     from '$app/state';
    import { goto }     from '$app/navigation';

    import PulseButton  from '$lib/components/buttons/pulse-button.svelte';
    import BackIcon     from '$lib/components/icons/BackIcon.svelte';


    let { children } = $props();

    // Estado del reproductor de música
    let audio           : HTMLAudioElement | null = null;
    let isPlaying       = $state( false );
    let volume          = $state( 0.8 );
    let isMuted         = $state( false );
    let currentSrc      = $state( '' );
    let returnTo        = $state( '/' );
    let hasAutoPlayed   = $state( false );
    let userPaused      = $state( false );
    let isDragging      = $state( false );
    let sliderRef       = $state<HTMLInputElement | null>( null );


    const quizState = $derived( page.url.searchParams.get( 'quizState' ) || '' );


    const getAudioSrc = ( pathname: string ): string =>
        pathname.includes( '/invoke' )
            ? `/sounds/invoke/invoke-${Math.floor( Math.random() * 10 ) + 1}.ogg`
            : '/sounds/background.mp3';

    // Inicializar audio
    onMount(() => {
        const initialSrc = getAudioSrc( window.location.pathname );

        currentSrc      = initialSrc;
        audio           = new Audio( initialSrc );
        audio.volume    = volume;
        audio.loop      = true;
        audio.muted     = isMuted;

        return () => {
            if ( audio ) {
                audio.pause();
                audio = null;
            }
        };
    });


    $effect(() => {
        const pathname: string = page.url.pathname;

        returnTo = {
            '/quiz'     : '/',
            '/invoke'   : '/quiz',
        }[pathname] || '/';

        if ( audio ) {
            const newSrc = getAudioSrc( pathname );

            if ( newSrc !== currentSrc ) {
                const wasPlaying = isPlaying;

                audio.pause();
                audio.src       = newSrc;
                audio.volume    = volume;
                audio.loop      = true;
                audio.muted     = isMuted;
                currentSrc      = newSrc;

                if ( wasPlaying ) {
                    audio.play().catch( err => console.error( 'Error al reproducir:', err ));
                }
            }

            // Reproducir automáticamente cuando quizState sea 'quiz' (solo la primera vez)
            if ( quizState === 'quiz' && !isPlaying && !hasAutoPlayed && !userPaused ) {
                audio.play()
                    .then(() => {
                        isPlaying       = true;
                        hasAutoPlayed   = true;
                    })
                    .catch( err => console.error( 'Error al reproducir:', err ));
            }

            // Resetear hasAutoPlayed cuando se sale del estado 'quiz'
            if ( quizState !== 'quiz' ) {
                hasAutoPlayed = false;
            }
        }
    });


    function togglePlay() {
        if ( !audio ) return;

        if ( isPlaying ) {
            audio.pause();
            isPlaying   = false;
            userPaused  = true;
        } else {
            audio.play()
                .then(() => {
                    isPlaying   = true;
                    userPaused  = false;
                })
                .catch( err => console.error( 'Error al reproducir:', err ));
        }
    }


    function toggleMute() {
        if ( !audio ) return;

        isMuted     = !isMuted;
        audio.muted = isMuted;
    }


    function handleVolumeChange( event: Event ) {
        if ( !audio ) return;

        const target    = event.target as HTMLInputElement;
        const newVolume = parseFloat( target.value );

        volume          = newVolume;
        audio.volume    = newVolume;
        isMuted         = newVolume === 0;
    }


    function handleSliderMouseDown( event: MouseEvent ) {
        isDragging = true;
        updateSliderValue( event );
    }


    function handleSliderMouseMove( event: MouseEvent ) {
        if ( !isDragging || !sliderRef ) return;
        updateSliderValue( event );
    }


    function handleSliderMouseUp() {
        isDragging = false;
    }


    function updateSliderValue( event: MouseEvent ) {
        if ( !sliderRef || !audio ) return;

        const rect      = sliderRef.getBoundingClientRect();
        const x         = Math.max( 0, Math.min( event.clientX - rect.left, rect.width ));
        const newVolume = x / rect.width;

        volume          = newVolume;
        audio.volume    = newVolume;
        isMuted         = newVolume === 0;
        sliderRef.value = newVolume.toString();
    }


    onMount(() => {
        const initialSrc = getAudioSrc( window.location.pathname );

        currentSrc      = initialSrc;
        audio           = new Audio( initialSrc );
        audio.volume    = volume;
        audio.loop      = true;
        audio.muted     = isMuted;

        // Agregar listeners globales para el arrastre
        window.addEventListener( 'mousemove', handleSliderMouseMove );
        window.addEventListener( 'mouseup', handleSliderMouseUp );

        return () => {
            if ( audio ) {
                audio.pause();
                audio = null;
            }

            window.removeEventListener( 'mousemove', handleSliderMouseMove );
            window.removeEventListener( 'mouseup', handleSliderMouseUp );
        };
    });</script>


<div class="min-h-screen relative">
    <!-- Botón Volver y Reproductor -->
    <div class="fixed top-4 left-4 right-4 mx-52 mt-10 z-50 flex items-center justify-between gap-4">
        <!-- Botón Volver -->
        <PulseButton text="Volver" onClick={() => goto(returnTo)} >
            <BackIcon />
        </PulseButton>

        <!-- Reproductor de Música -->
        {#if quizState !== 'intro'}
            <div class="bg-card/90 backdrop-blur-md border-2 border-primary/30 rounded-xl p-3 shadow-2xl shadow-primary/20 min-w-[320px]">
                <div class="flex items-center gap-4">
                    <!-- Botón Play/Pause -->
                    <button
                        onclick={togglePlay}
                        class="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border-2 border-primary/50 flex items-center justify-center shrink-0 transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
                        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
                        title={isPlaying ? 'Pausar música' : 'Reproducir música'}
                    >
                        {#if isPlaying}
                            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                        {:else}
                            <svg class="w-5 h-5 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        {/if}
                    </button>

                    <!-- Control de Volumen -->
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <button
                            onclick={toggleMute}
                            class="w-10 h-10 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-105 shrink-0"
                            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                        >
                            {#if isMuted || volume === 0}
                                <svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                </svg>
                            {:else}
                                <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                </svg>
                            {/if}
                        </button>

                        <div class="flex-1 flex flex-col gap-1">
                            <input
                                bind:this={sliderRef}
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                oninput={handleVolumeChange}
                                onmousedown={handleSliderMouseDown}
                                class="w-full h-3 rounded-full appearance-none cursor-pointer
                                    bg-secondary/50
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:w-[18px]
                                    [&::-webkit-slider-thumb]:h-[18px]
                                    [&::-webkit-slider-thumb]:-mt-[3px]
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-primary
                                    [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-webkit-slider-thumb]:border-[3px]
                                    [&::-webkit-slider-thumb]:border-background
                                    [&::-webkit-slider-thumb]:shadow-lg
                                    [&::-webkit-slider-thumb]:shadow-primary/50
                                    [&::-webkit-slider-thumb]:hover:scale-125
                                    [&::-webkit-slider-thumb]:active:scale-110
                                    [&::-webkit-slider-thumb]:transition-transform
                                    [&::-moz-range-thumb]:w-[18px]
                                    [&::-moz-range-thumb]:h-[18px]
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:bg-primary
                                    [&::-moz-range-thumb]:cursor-pointer
                                    [&::-moz-range-thumb]:shadow-lg
                                    [&::-moz-range-thumb]:shadow-primary/50
                                    [&::-moz-range-thumb]:hover:scale-125
                                    [&::-moz-range-thumb]:border-0
                                    [&::-webkit-slider-runnable-track]:h-3
                                    [&::-webkit-slider-runnable-track]:rounded-full
                                    [&::-webkit-slider-runnable-track]:bg-secondary/50
                                    [&::-moz-range-track]:h-3
                                    [&::-moz-range-track]:rounded-full
                                    [&::-moz-range-track]:bg-secondary/50"
                                aria-label="Control de volumen"
                            />

                            <div class="flex items-center justify-between px-1">
                                <span class="text-[10px] text-muted-foreground">0%</span>
                                <span class="text-xs text-primary font-semibold">{Math.round(volume * 100)}%</span>
                                <span class="text-[10px] text-muted-foreground">100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Contenido de la página -->
    {@render children()}
</div>
