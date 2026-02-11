
import { NEN_TYPES } from '$lib/data/nen-data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const primaryCode   = url.searchParams.get('primary');
    const secondaryCode = url.searchParams.get('secondary');

    let meta = {
        title       : 'Descubre tu Tipo de Nen - Hunter x Hunter',
        description : 'Responde este quiz de personalidad y descubre cual seria tu tipo de Nen si fueras un usuario en el mundo de Hunter x Hunter.',
        image       : 'https://nen.kevindeltastudios.com/og-image.png' // Placeholder for now, user needs to deploy
    };

    if ( primaryCode && NEN_TYPES[primaryCode as keyof typeof NEN_TYPES] ) {
        const primaryType   = NEN_TYPES[primaryCode as keyof typeof NEN_TYPES];
        const secondaryType = secondaryCode && NEN_TYPES[secondaryCode as keyof typeof NEN_TYPES] 
                            ? NEN_TYPES[secondaryCode as keyof typeof NEN_TYPES] 
                            : null;

        meta.title          = `¡Soy un usuario de ${primaryType.name}! - Test de Nen`;
        meta.description    = `Mi tipo de aura es ${primaryType.name}${secondaryType ? ` con afinidad a ${secondaryType.name}` : ''}. ${primaryType.description} ¡Haz el test y descubre el tuyo!`;
        
        // If we had per-type images, we would set them here
        // meta.image = `https://nen.kevindeltastudios.com/og/${primaryCode}.png`;
    }

    return {
        meta
    };
};
