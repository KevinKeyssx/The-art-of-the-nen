<script lang="ts">
    import { onMount }  from 'svelte';
    import { page }     from '$app/state';
    import {
        getLocalStorage,
        LOCAL_STORAGE_KEYS,
        setLocalStorage
    }                       from '$lib/utils/local-storage';

    import {
        playSound,
        SOUND_FILES
    }                       from '$lib/utils/player';
    import { NEN_TYPES }    from '$lib/data/nen-data';
    import { goto }         from '$app/navigation';
    import InvokeForm       from './components/InvokeForm.svelte';
    import Invoking         from './components/Invoking.svelte';
    import RevealHatsu      from './components/RevealHatsu.svelte';


    type PageState = 'form' | 'invoking' | 'revealed';


    let secondaryCode   = $state( 'EMI' );
    let primaryCode     = $state( 'INT' );
    let pageState       = $state<PageState>( 'form' );
    let loadingMessage  = $state( 'Canalizando tu Aura...' );
    let errorMessage    = $state( 'Tu Hatsu está tomando forma' );
    let loading         = $state( false );
    let hatsuResult     = $state<any>( null );


    const primary   = $derived( NEN_TYPES[primaryCode as keyof typeof NEN_TYPES]     || NEN_TYPES.INT );
    const secondary = $derived( NEN_TYPES[secondaryCode as keyof typeof NEN_TYPES]   || NEN_TYPES.EMI );

    // Mapeo de estados a archivos de sonido
    const stateSounds: Partial<Record<PageState, string>> = {
        invoking : SOUND_FILES.CALCULATING,
        revealed : SOUND_FILES.RESULT
    };

    onMount(() => {
        const params    = new URLSearchParams( window.location.search );
        primaryCode     = params.get( 'primary' ) || 'INT';
        secondaryCode   = params.get( 'secondary' ) || 'EMI';

        // Cargar datos desde localStorage
        const savedHatsu = getLocalStorage( LOCAL_STORAGE_KEYS.NEN_HATSU_RESULT );

        if ( !savedHatsu ) return;

        const savedPageState = params.get( 'pageState' ) as PageState;

        hatsuResult = savedHatsu;
        // Si hay un hatsuResult guardado y el pageState es 'revealed', mostrar todo
        if ( savedPageState === 'revealed' ) {
            pageState = 'revealed';
        }
    });

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
            setLocalStorage( LOCAL_STORAGE_KEYS.NEN_HATSU_RESULT, hatsuResult );
        }
    });

    // Reproducir sonido según el estado del quiz
    $effect(() => {
        const soundFile = stateSounds[ pageState ];

        if ( soundFile && ( pageState !== 'revealed' || hatsuResult )) {
            playSound( soundFile, 0.3 );
        }
    });
</script>


<svelte:head>
    <title>Invocar Habilidad Especial - Hunter x Hunter Nen</title>
    <meta name="description" content="Descubre cual seria tu habilidad especial Nen basada en tu tipo de aura." />
</svelte:head>


<div class="min-h-screen bg-background relative overflow-hidden">
    <!-- FORM STATE -->
    {#if pageState === 'form'}
        <InvokeForm
            { primary }
            { secondary }
            bind:loading
            bind:pageState
            bind:errorMessage
            bind:hatsuResult
        />
    {/if}

    <!-- INVOKING STATE -->
    {#if pageState === 'invoking'}
        <Invoking
            { primary }
            { secondary }
            { errorMessage }
            bind:loadingMessage
        />
    {/if}

    <!-- REVEALED STATE -->
    {#if pageState === 'revealed' && hatsuResult}
        <RevealHatsu
            { primary }
            { secondary }
            { hatsuResult }
            bind:pageState
        />
    {/if}
</div>
