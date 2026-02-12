import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

import { getLocalStorage, LOCAL_STORAGE_KEYS } from '$lib/utils/local-storage';


export const load: PageLoad = () => {
    if (typeof window !== 'undefined') {
        const userNenType = getLocalStorage( LOCAL_STORAGE_KEYS.NEN_QUIZ_RESULT );

        if ( !userNenType ) {
            throw redirect( 307, '/quiz' );
        }

        return {
            nenType: userNenType
        };
    }
};
