<script lang="ts">
    import TechniqueCard                from "$lib/components/cards/technique-card.svelte";
    import { ADVANCED_NEN_TECHNIQUES }  from "$lib/data/nen-data";
</script>


<section id="avanzadas" class="py-20 px-4 relative">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tecnicas Avanzadas</h2>

            <p class="text-muted-foreground max-w-2xl mx-auto">
                Aplicaciones complejas del Nen que requieren dominio de las tecnicas basicas. 
                Estas habilidades distinguen a los usuarios expertos de los novatos.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each ADVANCED_NEN_TECHNIQUES as technique, index}
                <div class="animate-fade-in-up" style="animation-delay: {index * 0.1}s;">
                    <TechniqueCard {technique} isBasic={false} />
                </div>
            {/each}
        </div>
    </div>
</section>
