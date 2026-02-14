<script lang="ts">
    interface Props {
        scrollToSection: ( sectionId: string ) => void;
    }


    let { scrollToSection }: Props = $props();
</script>


<nav class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-2">
                <!-- <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div class="w-4 h-4 rounded-full bg-primary aura-pulse"></div>
                </div> -->
                <img src="logo.png" alt="Logo" class="w-8 h-8">

                <span class="text-lg font-bold text-foreground">NEN</span>
            </div>

            <div class="hidden md:flex items-center gap-6">
                <button onclick={() => scrollToSection('tipos')} class="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tipos de Nen
                </button>

                <button onclick={() => scrollToSection('basicas')} class="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tecnicas Basicas
                </button>

                <button onclick={() => scrollToSection('avanzadas')} class="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tecnicas Avanzadas
                </button>

                <a href="/quiz" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Descubre tu Nen
                </a>
            </div>

            <a href="/quiz" class="md:hidden px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                Quiz
            </a>
        </div>
    </div>
</nav>
