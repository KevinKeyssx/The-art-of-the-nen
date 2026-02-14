<script lang="ts">
    import MagicButton  from "$lib/components/buttons/MagicButton.svelte";
    import PulseButton  from "$lib/components/buttons/pulse-button.svelte";
    import NenHexagon   from "$lib/components/nen-hexagon.svelte";

    interface Props {
        scrollToSection: ( sectionId: string ) => void;
    }


    let { scrollToSection }: Props = $props();
</script>


<section id="hero" class="min-h-screen flex items-center justify-center pt-18 relative">
    <div class="absolute inset-0 flex items-center justify-center opacity-10">
        <div class="w-[600px] h-[600px] rounded-full border border-primary/50 aura-pulse"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full border border-primary/30 aura-pulse" style="animation-delay: 0.5s;"></div>
        <div class="absolute w-[200px] h-[200px] rounded-full border border-primary/20 aura-pulse" style="animation-delay: 1s;"></div>
    </div>

    <div class="text-center px-4 relative z-10">
        <div class="mb-8">
            <NenHexagon />
        </div>

        <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            El Arte del <span class="text-primary">Nen</span>
        </h1>

        <p class="text-md sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Explora el complejo sistema de energia vital del universo de Hunter x Hunter. 
            Descubre los tipos de aura, domina las tecnicas y encuentra tu verdadero poder interior.
        </p>

        <div class="flex items-center justify-center gap-3 sm:gap-4">
            <PulseButton
                onClick     = { () => scrollToSection( 'tipos' )}
                className   = "w-42"
            >
                <span>Explorar el Nen</span>
            </PulseButton>

            <MagicButton />
        </div>
    </div>

    <div class="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
    </div>
</section>
