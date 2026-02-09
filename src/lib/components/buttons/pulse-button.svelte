<script lang="ts">
    let {
        onClick,
        text,
    }: { onClick: () => void, text: string } = $props();
</script>

<button class="button" onclick={onClick}>
    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" /><path d="M20 4v5h-5" /></svg> -->

     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
    { text }
</button>

<style>
    .button {
        position: relative;
        transition: all 0.3s ease-in-out;
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
        padding-block: .7rem;
        padding-inline: 1.25rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffff;
        gap: 10px;
        font-weight: bold;
        border: 1px solid #ffffff4d;
        outline: none;
        overflow: hidden;
        font-size: 15px;
    }

    .icon {
        width: 24px;
        height: 24px;
        transition: all 0.3s ease-in-out;
    }

    .button:hover {
        transform: scale(1.05);
        border-color: #fff9;
    }

    .button:hover .icon {
        transform: translate(4px);
    }

    .button:hover::before {
        animation: shine 1.5s ease-out infinite;
    }

    .button::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 100%;
        background-image: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(150, 138, 138, 0.8),
            rgba(255, 255, 255, 0) 70%
        );
        top: 0;
        left: -100px;
        opacity: 0.6;
    }

    @keyframes shine {
        0% {
            left: -100px;
        }

        60% {
            left: 100%;
        }

        to {
            left: 100%;
        }
    }


</style>