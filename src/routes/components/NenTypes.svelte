<script lang="ts">
    import NenTypeCard      from '$lib/components/nen-type-card.svelte';
    import { NEN_TYPES }    from '$lib/data/nen-data';

    const nenTypesArray = Object.values( NEN_TYPES );
</script>


<section id="tipos" class="py-20 px-4 relative">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">Los 6 Tipos de Nen</h2>

            <p class="text-muted-foreground max-w-2xl mx-auto">
                Cada usuario de Nen nace con una afinidad natural hacia uno de los seis tipos. 
                Tu personalidad determina tu tipo de aura.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each nenTypesArray as nenType, index}
                <div class="animate-fade-in-up" style="animation-delay: {index * 0.1}s;">
                    <NenTypeCard {nenType} />
                </div>
            {/each}
        </div>
    </div>
</section>
