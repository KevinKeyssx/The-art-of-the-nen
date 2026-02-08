<script lang="ts">
    import ParticleBackground from '$lib/components/particle-background.svelte';
	import '../app.css';

    let { children } = $props();
</script>

{@render children()}

<ParticleBackground />
