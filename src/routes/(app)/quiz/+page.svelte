<script lang="ts">
    import { onMount }  from 'svelte';
    import { goto }     from '$app/navigation';

    import {
        getRandomQuestions,
        calculateNenResult,
    }                   from '$lib/data/nen-data';
    import {
        playSound,
        SOUND_FILES
    }                   from '$lib/utils/player';
    import QuizResult   from '$lib/components/quiz/result/quiz-result.svelte';
    import Intro        from '$lib/components/quiz/intro/Intro.svelte';
    import QuizForm     from '$lib/components/quiz/form/QuizForm.svelte';
    import Calculating  from '$lib/components/quiz/calculating/Calculating.svelte';


    let isSoundEffectMuted  = $state( false );


    type QuizState = 'intro' | 'quiz' | 'calculating' | 'result';

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


    let { data }                = $props();
    let quizState               = $state<QuizState>('intro');
    let questions               = $state( getQuestionsWithShuffledOptions() );
    let result                  = $state<ReturnType<typeof calculateNenResult> | null>( null );


    function startQuiz() {
        questions               = getQuestionsWithShuffledOptions();
        result                  = null;
        quizState               = 'quiz';

        // Actualizar URL con el estado del quiz para que el layout lo detecte
        const url = new URL( window.location.href );
        url.searchParams.set( 'quizState', 'quiz' );
        goto( url.toString(), { replaceState: true, noScroll: true });
    }


    function restartQuiz() {
        quizState       = 'intro';
        result          = null;

        const url = new URL( window.location.href );
        url.searchParams.delete( 'quizState' );
        goto( url.toString(), { replaceState: true, noScroll: true });
    }


    onMount(() => {
        const url = new URL( window.location.href );
        url.searchParams.set( 'quizState', 'intro' );
        goto( url.toString(), { replaceState: true, noScroll: true });
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


<div class="min-h-screen bg-background relative overflow-hidden">
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
</div>
