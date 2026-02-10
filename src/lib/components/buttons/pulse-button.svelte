<script lang="ts">
    let {
        onClick,
        text,
        children
    }: { onClick: () => void, text: string, children?: any } = $props();
</script>

<button class="button" onclick={onClick}>
    {@render children?.()}

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


    .button:hover {
        transform: scale(1.05);
        border-color: #fff9;
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