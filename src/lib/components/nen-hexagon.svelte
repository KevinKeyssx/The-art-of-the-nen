<script lang="ts">
    import { NEN_TYPES } from '$lib/data/nen-data';

    let hoveredType = $state<string | null>( null );
    let mouseX = $state( 100 );
    let mouseY = $state( 100 );
    
    const types = [
        { code: 'INT', angle: -90 },
        { code: 'TRA', angle: -30 },
        { code: 'MAT', angle: 30 },
        { code: 'ESP', angle: 90 },
        { code: 'MAN', angle: 150 },
        { code: 'EMI', angle: 210 }
    ];

    // Helper to get coordinates for a type
    function getCoords( angle: number, radius: number = 70 ) {
        const rad = ( angle * Math.PI ) / 180;
        return {
            x: 100 + radius * Math.cos( rad ),
            y: 100 + radius * Math.sin( rad )
        };
    }

    // Calcular distancia de un punto (px, py) a un segmento de línea (x1, y1) -> (x2, y2)
    function distToSegment( px: number, py: number, x1: number, y1: number, x2: number, y2: number ) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if ( len_sq !== 0 ) param = dot / len_sq;

        let xx, yy;

        if ( param < 0 ) {
            xx = x1;
            yy = y1;
        } else if ( param > 1 ) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt( dx * dx + dy * dy );
    }

    // Calcular opacidad basada en proximidad
    function getLineOpacity( x1: number, y1: number, x2: number, y2: number ) {
        const dist = distToSegment( mouseX, mouseY, x1, y1, x2, y2 );
        // Max opacidad (1) a 0 distancia, min opacidad (0.1) a 60px distancia
        const maxDist = 60;
        const opacity = Math.max( 0.1, 1 - dist / maxDist );
        return opacity;
    }
    
    const colorClasses: Record<string, string> = {
        'nen-int' : 'bg-nen-int',
        'nen-tra' : 'bg-nen-tra',
        'nen-mat' : 'bg-nen-mat',
        'nen-esp' : 'bg-nen-esp',
        'nen-man' : 'bg-nen-man',
        'nen-emi' : 'bg-nen-emi'
    };
    
    const textColorClasses: Record<string, string> = {
        'nen-int' : 'text-nen-int',
        'nen-tra' : 'text-nen-tra',
        'nen-mat' : 'text-nen-mat',
        'nen-esp' : 'text-nen-esp',
        'nen-man' : 'text-nen-man',
        'nen-emi' : 'text-nen-emi'
    };

    const glowClasses: Record<string, string> = {
        'nen-int' : 'shadow-nen-int',
        'nen-tra' : 'shadow-nen-tra',
        'nen-mat' : 'shadow-nen-mat',
        'nen-esp' : 'shadow-nen-esp',
        'nen-man' : 'shadow-nen-man',
        'nen-emi' : 'shadow-nen-emi'
    };

    function handleMouseMove( e: MouseEvent ) {
        const svg = e.currentTarget as SVGSVGElement;
        const rect = svg.getBoundingClientRect();
        mouseX = ( ( e.clientX - rect.left ) / rect.width ) * 200;
        mouseY = ( ( e.clientY - rect.top ) / rect.height ) * 200;
    }

    function handleMouseLeave() {
        mouseX = 100;
        mouseY = 100;
        hoveredType = null;
    }
</script>

<div class="relative w-64 h-64 mx-auto">
    <!-- Center sun glow - multiple layers for depth -->
    <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-24 h-24 rounded-full bg-cyan-200/20 blur-2xl animate-pulse-slow"></div>
    </div>

    <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-white/30 blur-xl animate-pulse"></div>
    </div>

    <!-- Hexagon lines with animation -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg 
        class="absolute inset-0 w-full h-full hexagon-svg" 
        viewBox="0 0 200 200"
        onmousemove={handleMouseMove}
        onmouseleave={handleMouseLeave}
        role="presentation"
    >
        <!-- Outer Hexagon Lines -->
        {#each types as type, i}
            {@const nenType = NEN_TYPES[type.code as keyof typeof NEN_TYPES]}
            {@const current = getCoords( type.angle )}
            {@const next = getCoords( types[ ( i + 1 ) % types.length ].angle )}
            {@const opacity = getLineOpacity( current.x, current.y, next.x, next.y )}
            
            <line 
                x1={current.x} 
                y1={current.y} 
                x2={next.x} 
                y2={next.y} 
                stroke="currentColor" 
                stroke-width="1.5"
                class="{textColorClasses[nenType.color]} hexagon-line transition-all duration-75"
                style="opacity: {opacity}; filter: drop-shadow(0 0 {opacity * 8}px currentColor) brightness(1.5);"
            />
        {/each}

        <!-- Inner lines connecting to center -->
        {#each types as type, i}
            {@const nenType = NEN_TYPES[type.code as keyof typeof NEN_TYPES]}
            {@const point = getCoords( type.angle )}
            {@const opacity = getLineOpacity( 100, 100, point.x, point.y )}
            
            <line 
                x1="100" 
                y1="100" 
                x2={point.x} 
                y2={point.y} 
                stroke="currentColor" 
                stroke-width="1" 
                class="{textColorClasses[nenType.color]} inner-line"
                class:active-line={hoveredType === type.code}
                style="{hoveredType === type.code ? '' : `opacity: ${opacity * 0.5};`} filter: drop-shadow(0 0 {opacity * 5}px currentColor) brightness(1.5);"
            />
        {/each}
    </svg>

    <!-- Type nodes -->
    {#each types as type}
        {@const nenType = NEN_TYPES[type.code as keyof typeof NEN_TYPES]}
        {@const radius = 90}
        {@const x = 50 + ( radius / 2 ) * Math.cos( ( type.angle * Math.PI ) / 180 )}
        {@const y = 50 + ( radius / 2 ) * Math.sin( ( type.angle * Math.PI ) / 180 )}

        <div 
            class="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center group cursor-pointer transition-all duration-300"
            style="left: {x}%; top: {y}%;"
            role="button"
            tabindex="0"
            onmouseenter={() => hoveredType = type.code}
        >
            <!-- Persistent aura pulse - subtler -->
            <div class="absolute inset-0 rounded-full {colorClasses[nenType.color]} opacity-5 blur-sm aura-pulse"></div>
            <div class="absolute inset-0 rounded-full {colorClasses[nenType.color]} opacity-5 blur-md aura-pulse-slow"></div>
            
            <!-- Glow effect on hover -->
            {#if hoveredType === type.code}
                <div class="absolute inset-0 rounded-full {colorClasses[nenType.color]} opacity-20 blur-xl animate-pulse"></div>
            {/if}
            
            <!-- Node circle -->
            <div class="relative w-6 h-6 rounded-full {colorClasses[nenType.color]} opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg {glowClasses[nenType.color]} node-pulse">
                <!-- Inner glow -->
                <div class="absolute inset-0 rounded-full {colorClasses[nenType.color]} opacity-50 blur-sm"></div>
            </div>
            
            <!-- Type name - short by default, full on hover -->
            <div class="mt-2 text-center transition-all duration-300 relative z-10">
                {#if hoveredType === type.code}
                    <span class="text-sm font-bold {textColorClasses[nenType.color]} whitespace-nowrap animate-fade-in block" style="text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                        {nenType.name}
                    </span>
                {:else}
                    <span class="text-xs font-medium {textColorClasses[nenType.color]} opacity-90 group-hover:opacity-100 transition-opacity block" style="text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                        {nenType.name.slice( 0, 3 )}
                    </span>
                {/if}
            </div>
        </div>
    {/each}

    <!-- Center sun node -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center pointer-events-none">
        <!-- Rotating ring -->
        <div class="absolute inset-0 rounded-full border-2 border-cyan-300/30 animate-spin-slow"></div>
        <div class="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-reverse"></div>
        
        <!-- Sun core -->
        <div class="relative w-8 h-8 rounded-full bg-linear-to-br from-white via-cyan-100 to-cyan-200 flex items-center justify-center shadow-lg shadow-cyan-300/50 sun-pulse">
            <div class="w-4 h-4 rounded-full bg-white animate-pulse"></div>
        </div>
    </div>
</div>

<style>
    /* .hexagon-line removed from here to be inline-styled for dynamic opacity */
    
    .inner-line {
        transition      : all 0.3s ease;
    }

    .active-line {
        stroke-width    : 2;
        opacity         : 1 !important;
        filter          : drop-shadow( 0 0 4px currentColor );
    }

    .node-pulse {
        animation       : node-pulse 2s ease-in-out infinite;
    }

    .sun-pulse {
        animation       : sun-pulse 4s ease-in-out infinite;
    }

    @keyframes pulse-glow {
        0%, 100% {
            opacity     : 0.5;
        }
        50% {
            opacity     : 1;
        }
    }

    @keyframes node-pulse {
        0%, 100% {
            transform   : scale( 1 );
        }
        50% {
            transform   : scale( 1.1 );
        }
    }

    @keyframes sun-pulse {
        0%, 100% {
            box-shadow  : 0 0 20px rgba( 34, 211, 238, 0.5 ),
                        0 0 40px rgba( 255, 255, 255, 0.3 );
        }
        50% {
            box-shadow  : 0 0 30px rgba( 34, 211, 238, 0.8 ),
                        0 0 60px rgba( 255, 255, 255, 0.5 );
        }
    }

    @keyframes fade-in {
        from {
            opacity     : 0;
            transform   : translateY( -5px );
        }
        to {
            opacity     : 1;
            transform   : translateY( 0 );
        }
    }

    .animate-fade-in {
        animation       : fade-in 0.3s ease-out;
    }

    .animate-pulse-slow {
        animation       : pulse 4s cubic-bezier( 0.4, 0, 0.6, 1 ) infinite;
    }

    .animate-spin-slow {
        animation       : spin 20s linear infinite;
    }

    .animate-spin-reverse {
        animation       : spin 15s linear infinite reverse;
    }

    .aura-pulse {
        animation       : aura-pulse 3s ease-in-out infinite;
    }

    .aura-pulse-slow {
        animation       : aura-pulse 5s ease-in-out infinite;
    }

    @keyframes aura-pulse {
        0%, 100% {
            transform   : scale( 0.2 );
            opacity     : 0;
        }
        50% {
            transform   : scale( 0.6 );
            opacity     : 0.15;
        }
    }

    @keyframes spin {
        from {
            transform   : rotate( 0deg );
        }
        to {
            transform   : rotate( 360deg );
        }
    }
</style>
