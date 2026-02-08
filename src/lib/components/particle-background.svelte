<script lang="ts">
    import { onMount } from 'svelte';

    let particles = $state<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; color: string }>>([]);

    const colors = [
        'bg-nen-int/30',
        'bg-nen-tra/30',
        'bg-nen-mat/30',
        'bg-nen-esp/30',
        'bg-nen-man/30',
        'bg-nen-emi/30'
    ];

    onMount(() => {
        const newParticles = Array.from({ length: 100 }, () => ({
            id          : Math.random(),
            x           : Math.random() * 100,
            y           : Math.random() * 100,
            size        : Math.random() * 4 + 2,
            delay       : Math.random() * 5,
            duration    : Math.random() * 3 + 3,
            color       : colors[Math.floor(Math.random() * colors.length)]
        }) );

        particles = newParticles;
    });
</script>

<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {#each particles as particle}
        <div
            class="absolute rounded-full {particle.color} particle"
            style="
                left: {particle.x}%;
                top: {particle.y}%;
                width: {particle.size}px;
                height: {particle.size}px;
                animation-delay: {particle.delay}s;
                animation-duration: {particle.duration}s;"
        ></div>
    {/each}
</div>
