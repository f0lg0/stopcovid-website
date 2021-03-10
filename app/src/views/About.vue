<template>
    <AboutDesktop v-if="!$store.getters.mobile" />
    <div class="mobile" v-else>
        <div class="logo">
            <img src="../assets/logo.jpeg" alt="StopCovid logo" />
        </div>

        <div class="text">
            <h1>StopCovid</h1>
            <p class="info">
                Stop Covid è un semplice canale YouTube, creato da
                <span>studenti</span> dell'istituto superiore
                <span>Vincenzo Capirola</span>.
                <br />
                <br />Il nostro scopo è quello di fornire a voi della community
                <span>informazioni chiare</span> riguardo alla pandemia da
                <span>Covid-19.</span>
            </p>
        </div>

        <div class="details">
            <h2>Dettagli tecnici:</h2>
            <p>
                Sito web
                <span>Open source</span>
                su
                <a href="http://github.com/f0lg0/stopcovid-website" target="_blank" rel="noopener noreferrer">GitHub</a>
            </p>

            <h3>Dati utilizzati</h3>
            <p style="font-weight: 600;">Fonte:</p>
            <p>
                <a href="https://github.com/pcm-dpc/COVID-19" target="_blank" rel="noopener noreferrer">PCM-DPC</a>
            </p>
            <p style="font-weight: 600;">Popolazione d'Italia:</p>
            <p>60234639</p>

            <p style="font-weight: 600;">Popolazione Lombardia:</p>
            <p>10002615</p>

            <p style="font-weight: 600;">Popolazione Brescia</p>
            <p>1255437</p>
        </div>
    </div>
</template>

<script>
import AboutDesktop from "../components/desktop/About";

export default {
    components: {
        AboutDesktop,
    },
};
</script>

<style scoped>
.mobile {
    background-color: var(--main-red);
    text-align: center;
    color: white;
}

.logo {
    width: 80%;
    height: 300px;
    margin: auto;
}

.logo img {
    width: 100%;
    height: 100%;
}

.text {
    width: 80%;
    margin: auto;
}

.text h1 {
    font-size: 40px;
}

.info {
    font-weight: 200;
    font-size: 20px;

    margin-top: 20px;
}

.info span {
    font-weight: 400;
}

.details {
    margin-top: 60px;
    padding-bottom: 50px;
}

.details h2 {
    font-size: 40px;
}

.details h3 {
    font-size: 30px;
    margin-top: 50px;
    font-weight: 400;
}

.details p {
    margin-top: 25px;
    font-size: 20px;
    font-weight: 200;
}

.details a {
    font-weight: 200;
    text-decoration: underline;
    color: white;
}

.details span {
    font-weight: 400;
}
</style>