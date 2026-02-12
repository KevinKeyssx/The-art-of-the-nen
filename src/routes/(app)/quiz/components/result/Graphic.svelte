<script lang="ts">
    import { onMount }  from "svelte";

    import {
        Chart,
        RadarController,
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    } from 'chart.js';

    import {
        colorClasses,
        nenColorVars,
        textColorClasses
    }                           from "$lib/utils/nen-colors";
    import NenCard              from "$lib/components/cards/nen-card.svelte";
    import type { NenResult }   from '$lib/models/nen';
    import { capitalize }       from "$lib/utils/strings";


    Chart.register(
        RadarController,
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    );


    let { result }: { result: NenResult } = $props();
    let chartCanvas = $state<HTMLCanvasElement>();
    let chartInstance: Chart | null = null;


    onMount(() => {
        // Chart initialization
        setTimeout(() => {
            if ( !chartCanvas ) return;

            const isMobile      = window.innerWidth < 768;
            const dataOrder     = [ 'INT', 'TRA', 'MAT', 'ESP', 'MAN', 'EMI' ];
            const data          = dataOrder.map( code => result.scores[code] || 0 );
            const baseLabels    = [ 'Intensificación', 'Transmutación', 'Materialización', 'Especialización', 'Manipulación', 'Emisión' ];
            const labelsToShow  = isMobile ? dataOrder.map( code =>  capitalize( code )) : baseLabels;
            const labels        = labelsToShow.map(( name, i ) => `${name} (${data[i]})` );
            const primaryColor  = result.primary.color;

            // Array de colores correspondiente al orden de los datos
            const pointColors = [
                nenColorVars['nen-int'], // Intensificación
                nenColorVars['nen-tra'], // Transmutación
                nenColorVars['nen-mat'], // Materialización
                nenColorVars['nen-esp'], // Especialización
                nenColorVars['nen-man'], // Manipulación
                nenColorVars['nen-emi']  // Emisión
            ];

            const mainColor = nenColorVars[primaryColor] || '#ffffff';

            chartInstance = new Chart(chartCanvas, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Afinidad de Aura',
                        data: data,
                        fill: true,
                        backgroundColor: `${mainColor}33`, // 20% opacity del tipo principal
                        borderColor: mainColor,
                        borderWidth: 2,
                        // Puntos multicolores
                        pointBackgroundColor: pointColors, 
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: pointColors,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 0,
                            max: 7, // Fijamos el máximo en 7 para que la escala sea absoluta y correcta
                            beginAtZero: true,
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                circular: false // Líneas rectas (hexagonal) para ser fiel al diagrama original de Nen
                            },
                            pointLabels: {
                                // Etiquetas multicolores usando callback para evitar error de tipos
                                color: (context) => pointColors[context.index],
                                font: {
                                    size: 13,
                                    weight: 'bold'
                                },
                                backdropPadding: 10
                            },
                            ticks: {
                                display: false,
                                backdropColor: 'transparent'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                title: () => '', // Ocultar título global para evitar confusión en puntos superpuestos
                                label: function(context) {
                                    const points = context.raw as number;
                                    const pointText = points === 1 ? 'Punto' : 'Puntos';
                                    return `Afinidad del aura ${context.label.split('(')[0].toLowerCase()}${points} ${pointText}.`;
                                    // return [`${context.label}:`, `Puntos: ${context.raw}`];
                                }
                            }
                        }
                    }
                }
            });
        }, 100);

        return () => {
            if ( chartInstance ) {
                chartInstance.destroy();
            }
        };
    });
</script>

<NenCard
    borderColor = { result.primary.color }
    showGlow    = { false}
    showAura    = { true }
    delay       = "animate-delay-4000"
>
    <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-6 rounded-full {colorClasses[result.primary.color]}"></div>

        <h3 class="text-lg font-bold {textColorClasses[result.primary.color]}">
            Afinidad de tu Aura
        </h3>
    </div>

    <div class="flex relative w-full h-[300px] sm:h-[400px] items-center justify-center">
        <canvas bind:this={chartCanvas}></canvas>
    </div>
</NenCard>
