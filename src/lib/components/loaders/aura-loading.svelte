<script lang="ts">
    // Props para personalizar los colores según el tipo de Nen
    let { 
        primaryColor = 'hsl(45 100% 50%)',      // Color principal (default: Intensificación)
        secondaryColor = 'hsl(25 95% 55%)',     // Color secundario (default: Emisión)
        size = 2                                 // Tamaño del loader (multiplicador)
    } = $props();
</script>

<div class="loader-container">
    <div 
        class="loader" 
        style="
            --color-primary: {primaryColor};
            --color-secondary: {secondaryColor};
            --loader-size: {size};
        "
    >
        <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
                <mask id="clipping">
                    <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                    <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                    <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                </mask>
            </defs>
        </svg>
        <div class="box"></div>
    </div>
</div>

<style>
    .loader-container {
        display           : flex;
        align-items       : center;
        justify-content   : center;
        width             : 100%;
        height            : 100%;
    }

    .loader {
        --time-animation  : 2s;
        position          : relative;
        border-radius     : 50%;
        transform         : scale( var( --loader-size, 2 ));
        box-shadow        :
            0 0 25px 0 color-mix( in srgb, var( --color-primary ) 50%, transparent ),
            0 20px 50px 0 color-mix( in srgb, var( --color-secondary ) 50%, transparent );
        animation         : aura-pulse calc( var( --time-animation ) * 1.5 ) ease-in-out infinite;
        animation-play-state : running !important;
    }

    .loader::before {
        content           : "";
        position          : absolute;
        top               : 0;
        left              : 0;
        width             : 100px;
        height            : 100px;
        border-radius     : 50%;
        border-top        : solid 1px var( --color-primary );
        border-bottom     : solid 1px var( --color-secondary );
        background        : linear-gradient( 
            180deg, 
            color-mix( in srgb, var( --color-primary ) 25%, transparent ), 
            color-mix( in srgb, var( --color-secondary ) 50%, transparent )
        );
        box-shadow        :
            inset 0 10px 10px 0 color-mix( in srgb, var( --color-primary ) 50%, transparent ),
            inset 0 -10px 10px 0 color-mix( in srgb, var( --color-secondary ) 50%, transparent );
    }

    .loader .box {
        width             : 100px;
        height            : 100px;
        background        : linear-gradient(
            180deg,
            var( --color-primary ) 30%,
            var( --color-secondary ) 70%
        );
        mask              : url(#clipping);
        -webkit-mask      : url(#clipping);
    }

    .loader svg {
        position          : absolute;
    }

    .loader svg :global(#clipping) {
        filter            : contrast(15);
        animation         : roundness calc( var( --time-animation ) / 2 ) linear infinite;
        animation-play-state : running !important;
    }

    .loader svg :global(#clipping polygon) {
        filter            : blur(7px);
    }

    .loader svg :global(#clipping polygon:nth-child(1)) {
        transform-origin  : 75% 25%;
        transform         : rotate(90deg);
    }

    .loader svg :global(#clipping polygon:nth-child(2)) {
        transform-origin  : 50% 50%;
        animation         : rotation var( --time-animation ) linear infinite reverse;
        animation-play-state : running !important;
    }

    .loader svg :global(#clipping polygon:nth-child(3)) {
        transform-origin  : 50% 60%;
        animation         : rotation var( --time-animation ) linear infinite;
        animation-delay   : calc( var( --time-animation ) / -3 );
        animation-play-state : running !important;
    }

    .loader svg :global(#clipping polygon:nth-child(4)) {
        transform-origin  : 40% 40%;
        animation         : rotation var( --time-animation ) linear infinite reverse;
        animation-play-state : running !important;
    }

    .loader svg :global(#clipping polygon:nth-child(5)) {
        transform-origin  : 40% 40%;
        animation         : rotation var( --time-animation ) linear infinite reverse;
        animation-delay   : calc( var( --time-animation ) / -2 );
        animation-play-state : running !important;
    }

    .loader svg :global(#clipping polygon:nth-child(6)) {
        transform-origin  : 60% 40%;
        animation         : rotation var( --time-animation ) linear infinite;
        animation-play-state : running !important;
    }

    .loader svg :global(#clipping polygon:nth-child(7)) {
        transform-origin  : 60% 40%;
        animation         : rotation var( --time-animation ) linear infinite;
        animation-delay   : calc( var( --time-animation ) / -1.5 );
        animation-play-state : running !important;
    }

    @keyframes rotation {
        0% {
            transform     : rotate(0deg);
        }
        100% {
            transform     : rotate(360deg);
        }
    }

    @keyframes roundness {
        0% {
            filter        : contrast(15);
        }
        20% {
            filter        : contrast(3);
        }
        40% {
            filter        : contrast(3);
        }
        60% {
            filter        : contrast(15);
        }
        100% {
            filter        : contrast(15);
        }
    }

    @keyframes aura-pulse {
        0%, 100% {
            opacity       : 1;
            transform     : scale( var( --loader-size, 2 ));
        }
        50% {
            opacity       : 0.8;
            transform     : scale( calc( var( --loader-size, 2 ) * 1.05 ));
        }
    }
</style>