<template>
    <div id="home-desktop">
        <div class="banner">
            <div class="slogan">
                <h1>StopCovid</h1>
                <h2>
                    Analisi settimanale dei dati
                    relativi alla nostra Nazione.
                </h2>

                <p>Seguici su:</p>
                <div class="icons">
                    <div class="instagram" @click="routeExt('https://www.instagram.com/stopcovidoff/')">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-brand-instagram"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            stroke-width="1.0"
                            stroke="#ffffff"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <rect x="4" y="4" width="16" height="16" rx="4" />
                            <circle cx="12" cy="12" r="3" />
                            <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
                        </svg>
                    </div>
                    <div class="twitter" @click="routeExt('https://twitter.com/StopCovidOff')">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-brand-twitter"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            stroke-width="1.0"
                            stroke="#ffffff"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
                            />
                        </svg>
                    </div>
                    <div class="facebook" @click="routeExt('https://www.facebook.com/StopCovidOff/')">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-brand-facebook"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            stroke-width="1.0"
                            stroke="#ffffff"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                        </svg>
                    </div>
                    <div class="youtube" @click="routeExt('https://www.youtube.com/channel/UCM37P5kaCk_gmHyDN7b-J7A?sub_confirmation=1')">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-brand-youtube"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            stroke-width="1.0"
                            stroke="#ffffff"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <rect x="3" y="5" width="18" height="14" rx="4" />
                            <path d="M10 9l5 3l-5 3z" />
                        </svg>
                    </div>
                    <div class="telegram" @click="routeExt('https://t.me/StopCovidOff')">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-brand-telegram"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            stroke-width="1"
                            stroke="#ffffff"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="logo">
                <img src="../../assets/logo.jpeg" alt="Logo StopCovid" />
            </div>
        </div>

        <div class="board">
            <div class="switcher">
                <Switcher op1="Italia" op2="Lombardia" op3="Brescia" v-on:switched="switched($event)" />
            </div>

            <div class="data">
                <ItaliaDesktop v-if="selected == 'Italia'" v-on:gotWeek="latestWeek = $event" />
                <LombardiaDesktop v-if="selected == 'Lombardia'" />
                <BresciaDesktop v-if="selected == 'Brescia'" />
            </div>
        </div>
    </div>
</template>

<script>
import Switcher from "../Switcher";
import ItaliaDesktop from "./Italia";
import LombardiaDesktop from "./Lombardia";
import BresciaDesktop from "./Brescia";

export default {
    data() {
        return {
            latestWeek: "?",
            selected: "Italia",
        };
    },
    components: { Switcher, ItaliaDesktop, LombardiaDesktop, BresciaDesktop },
    methods: {
        switched(op) {
            if (op == 1 && this.selected != "Italia") {
                this.selected = "Italia";
            } else if (op == 2 && this.selected != "Lombardia") {
                this.selected = "Lombardia";
            } else if (op == 3 && this.selected != "Brescia") {
                this.selected = "Brescia";
            }
        },
        routeExt(url) {
            location.href = url;
        },
    },
};
</script>

<style scoped>
#home-desktop {
    height: 100vh;
}
.banner {
    height: 500px;

    display: flex;
    flex-direction: row;

    z-index: 0;
}

.slogan {
    width: 60%;
    background-color: var(--main-red);
    padding: 100px;
    padding-left: 130px;
    color: white;
}

.slogan h1 {
    font-weight: 900;
    font-size: 65px;
}

.slogan h2 {
    font-weight: 300;
    font-size: 23px;
    margin-top: 25px;
}

.slogan p {
    font-weight: 200;
    font-size: 20px;
    margin-top: 35px;
}

.logo {
    width: 40%;
    height: 100%;
    background-color: var(--main-red);
}

.logo img {
    width: 100%;
    max-width: 520px;
    min-width: 400px;
    height: 80%;
    margin-top: 80px;
}

.icons {
    display: flex;
    flex-direction: row;

    margin-top: 20px;
}

.icons svg:hover {
    stroke-width: 1.5;
}

.icons div {
    margin-right: 40px;
}

.board {
    width: 90%;
    margin: auto;
    height: 600px;
    margin-top: 50px;
}

.switcher {
    width: 60%;
    max-width: 600px;
    height: 100px;
    margin: auto;

    padding-top: 50px;
    padding-bottom: 100px;
}

.data {
    width: 100%;
    height: 600px;
    margin: auto;
    margin-top: 50px;
    margin-bottom: 100px;
}
</style>