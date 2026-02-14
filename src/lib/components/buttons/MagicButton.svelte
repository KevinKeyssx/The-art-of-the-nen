<script>
    import { goto } from "$app/navigation";
</script>


<button class="glass-btn" onclick={() => goto('/quiz')}>
    <span>Descubre tu Nen</span>
</button>


<style>
    .glass-btn {
        position          : relative;
        padding           : 12px 24px;
        font-size         : 17px;
        color             : #fff;
        border            : none;
        background        : rgba( 245, 158, 11, 0.15 );
        border-radius     : 10px;
        backdrop-filter   : blur( 15px );
        cursor            : pointer;
        box-shadow        :
            0 10px 20px rgba( 245, 158, 11, 0.2 ),
            inset 0 0 0 1px rgba( 245, 158, 11, 0.3 );
        overflow          : hidden;
        transition        : all 0.4s cubic-bezier( 0.4, 0, 0.2, 1 );
        text-shadow       : 0 1px 2px rgba( 0, 0, 0, 0.1 );
    }

    .glass-btn::before {
        content           : "";
        position          : absolute;
        top               : 0;
        left              : -100%;
        width             : 100%;
        height            : 100%;
        background        : linear-gradient(
            90deg,
            transparent,
            rgba( 245, 158, 11, 0.4 ),
            transparent
        );
        transition        : 0.6s;
    }

    .glass-btn::after {
        content           : "";
        position          : absolute;
        inset             : 0;
        background        : radial-gradient(
            circle at center,
            rgba( 245, 158, 11, 0.2 ) 0%,
            transparent 70%
        );
        opacity           : 0;
        transition        : opacity 0.4s ease;
    }

    .glass-btn:hover {
        transform         : translateY( -3px ) scale( 1.02 );
        background        : rgba( 245, 158, 11, 0.25 );
        box-shadow        :
            0 15px 30px rgba( 245, 158, 11, 0.3 ),
            inset 0 0 0 1px rgba( 245, 158, 11, 0.4 );
        /* letter-spacing    : 1.5px; */
    }

    .glass-btn:hover::before {
        left: 100%;
    }

    .glass-btn:hover::after {
        opacity: 1;
    }

    .glass-btn:active {
        transform         : translateY( 1px ) scale( 0.98 );
        box-shadow        :
            0 5px 15px rgba( 245, 158, 11, 0.2 ),
            inset 0 0 0 1px rgba( 245, 158, 11, 0.3 );
        background        : rgba( 245, 158, 11, 0.3 );
    }

    .glass-btn span {
        position: relative;
        z-index: 1;
        font-weight: 500;
    }

    @keyframes gradientBG {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>
