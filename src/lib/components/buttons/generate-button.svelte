<script lang="ts">
    let { 
        text,
        onclick 
    }: { 
        text: string; 
        onclick?: () => void 
    } = $props();
</script>

<button class="synthwave-laser-button flex items-center gap-2" {onclick}>
    <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
    </svg>
    { text }
</button>

<style>
    .synthwave-laser-button {
        position            : relative;
        padding             : 14px 35px;
        font-size           : 14px;
        text-transform      : capitalize;
        color               : #fff;
        background          : #0a0a0f;
        border              : none;
        cursor              : pointer;
        letter-spacing      : 1px;
        text-shadow         :
            0 0 5px rgba(168, 85, 247, 0.8),
            0 0 15px rgba(168, 85, 247, 0.5);
        box-shadow          :
            inset 0 0 15px rgba(168, 85, 247, 0.3),
            0 0 20px rgba(168, 85, 247, 0.4);
        overflow            : hidden;
        border-radius       : 10px;
        z-index             : 1;
        transition          :
            box-shadow 0.3s ease,
            transform 0.3s ease;
        font-weight         : 500;
    }

    .synthwave-laser-button::before,
    .synthwave-laser-button::after {
        content             : "";
        position            : absolute;
        top                 : 0;
        left                : 0;
        width               : 100%;
        height              : 100%;
        background          : linear-gradient(
            90deg,
            transparent,
            rgba(168, 85, 247, 0.4),
            transparent
        );
        z-index             : -1;
        filter              : blur(8px);
        transform           : translateX(-100%);
        animation           : laser-glow 6s infinite linear;
    }

    .synthwave-laser-button::after {
        animation-delay     : 3s;
        background          : linear-gradient(
            90deg,
            transparent,
            rgba(236, 72, 153, 0.4),
            transparent
        );
    }

    @keyframes laser-glow {
        0% {
            transform       : translateX(-100%);
        }
        100% {
            transform       : translateX(100%);
        }
    }

    .synthwave-laser-button:hover {
        transform           : translateY(-3px) scale(1.02);
        box-shadow          :
            inset 0 0 20px rgba(168, 85, 247, 0.5),
            0 0 30px rgba(168, 85, 247, 0.6);
    }

    .synthwave-laser-button:active {
        transform           : scale(0.98);
        box-shadow          :
            inset 0 0 20px rgba(168, 85, 247, 0.6),
            0 0 25px rgba(236, 72, 153, 0.5);
    }
</style>
