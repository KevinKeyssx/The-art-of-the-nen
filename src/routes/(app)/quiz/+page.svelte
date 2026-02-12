<script lang="ts">
    import { onMount }  from 'svelte';
    import { goto }     from '$app/navigation';
    import { page }     from '$app/state';

    import {
        clearLocalStorage,
        getLocalStorage,
        LOCAL_STORAGE_KEYS,
        removeLocalStorage,
        setLocalStorage
    }                   from '$lib/utils/local-storage';
    import {
        getRandomQuestions,
        calculateNenResult,
    }                   from '$lib/data/nen-data';
    import {
        playSound,
        SOUND_FILES
    }                   from '$lib/utils/player';
    import QuizResult   from './components/result/quiz-result.svelte';
    import Intro        from './components/Intro.svelte';
    import QuizForm     from './components/QuizForm.svelte';
    import Calculating  from './components/Calculating.svelte';


    type QuizState = 'intro' | 'quiz' | 'calculating' | 'result';


    let { data } = $props();


    let quizState           = $state<QuizState>('intro');
    let questions           = $state( getQuestionsWithShuffledOptions() );
    let result              = $state<ReturnType<typeof calculateNenResult> | null>( null );
    let isSoundEffectMuted  = $state( false );

    // Mapeo de estados a archivos de sonido
    const stateSounds: Partial<Record<QuizState, string>> = {
        calculating : SOUND_FILES.CALCULATING,
        result      : SOUND_FILES.RESULT
    };

    // Reproducir sonido según el estado del quiz
    $effect(() => {
        const soundFile = stateSounds[ quizState ];

        if ( soundFile && ( quizState !== 'result' || result )) {
            playSound( soundFile, 0.3 );
        }
    });

    // Sincronizar el quizState con la URL (Igual que en Invoke)
    $effect(() => {
        const currentState = page.url.searchParams.get( 'quizState' );

        if ( currentState !== quizState ) {
            const url = new URL( window.location.href );
            url.searchParams.set( 'quizState', quizState );
            goto( url.toString(), { replaceState: true, noScroll: true });
        }
    });


    // Funcion para mezclar array (Fisher-Yates shuffle)
    function shuffleArray<T>( array: T[] ): T[] {
        const shuffled = [ ...array ];

        for ( let i = shuffled.length - 1; i > 0; i-- ) {
            const j = Math.floor( Math.random() * ( i + 1 ));
            [ shuffled[ i ], shuffled[ j ]] = [ shuffled[ j ], shuffled[ i ]];
        }

        return shuffled;
    }

    // Obtener preguntas con opciones ya shuffleadas
    function getQuestionsWithShuffledOptions() {
        const randomQuestions = getRandomQuestions(7);

        return randomQuestions.map( q => ({
            ...q,
            options: shuffleArray( q.options )
        }));
    }


    function startQuiz() {
        removeLocalStorage( LOCAL_STORAGE_KEYS.NEN_QUIZ_RESULT );

        questions   = getQuestionsWithShuffledOptions();
        result      = null;
        quizState   = 'quiz';

        // Actualizar URL con el estado del quiz para que el layout lo detecte
        const url = new URL( window.location.href );
        url.searchParams.set( 'quizState', 'quiz' );
        goto( url.toString(), { replaceState: true, noScroll: true });
    }


    function restartQuiz() {
        clearLocalStorage();

        quizState   = 'intro';
        result      = null;

        const url = new URL( window.location.href );
        url.searchParams.delete( 'quizState' );
        goto( url.toString(), { replaceState: true, noScroll: true });
    }


    onMount(() => {
        const savedResult = getLocalStorage( LOCAL_STORAGE_KEYS.NEN_QUIZ_RESULT );

        if ( savedResult ) {
            try {
                result      = savedResult;
                quizState   = 'result';
                return;
            } catch ( error ) {
                console.error( 'Error parsing saved result', error );
                removeLocalStorage( LOCAL_STORAGE_KEYS.NEN_QUIZ_RESULT );
            }
        }

        const urlParams = new URLSearchParams( window.location.search );
        const savedState = urlParams.get( 'quizState' );

        if ( !savedState ) {
            quizState = 'intro';
        } else if ( savedState === 'quiz' ) {
            quizState = 'intro';
        }
    });


    $effect(() => {
        if ( result ) {
            setLocalStorage( LOCAL_STORAGE_KEYS.NEN_QUIZ_RESULT, result );
        }
    });
</script>


<svelte:head>
    <title>{data.meta?.title || 'Descubre tu Tipo de Nen - Hunter x Hunter'}</title>
    <meta name="description" content={data.meta?.description || "Responde este quiz de personalidad y descubre cual seria tu tipo de Nen si fueras un usuario en Hunter x Hunter."} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://nen.kevindeltastudios.com/'} />
    <meta property="og:title" content={data.meta?.title || 'Descubre tu Tipo de Nen - Hunter x Hunter'} />
    <meta property="og:description" content={data.meta?.description || "Responde este quiz de personalidad y descubre cual seria tu tipo de Nen si fueras un usuario en Hunter x Hunter."} />
    <meta property="og:image" content={data.meta?.image || 'https://nen.kevindeltastudios.com/og-image.png'} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : 'https://nen.kevindeltastudios.com/'} />
    <meta property="twitter:title" content={data.meta?.title || 'Descubre tu Tipo de Nen - Hunter x Hunter'} />
    <meta property="twitter:description" content={data.meta?.description || "Responde este quiz de personalidad y descubre cual seria tu tipo de Nen si fueras un usuario en Hunter x Hunter."} />
    <meta property="twitter:image" content={data.meta?.image || 'https://nen.kevindeltastudios.com/og-image.png'} />
</svelte:head>


<main class="min-h-screen bg-background relative overflow-hidden">
    <!-- Intro State -->
    {#if quizState === 'intro'}
        <Intro startQuiz={startQuiz} />
    {/if}

    <!-- Quiz State -->
    {#if quizState === 'quiz'}
        <QuizForm
            questions           = { questions }
            isSoundEffectMuted  = { isSoundEffectMuted }
            onComplete          = {( finalAnswers: string[] ) => {
                quizState = 'calculating';

                // Dramatic calculation delay
                setTimeout(() => {
                    result      = calculateNenResult( finalAnswers );
                    quizState   = 'result';
                }, 3000);
            }}
        />
    {/if}

    <!-- Calculating State -->
    {#if quizState === 'calculating'}
        <Calculating />
    {/if}

    <!-- Result State -->
    {#if quizState === 'result' && result}
        <QuizResult {result} onRestart={restartQuiz} />
    {/if}
</main>
