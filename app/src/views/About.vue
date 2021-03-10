<template>
    <div id="about">
        <h1>About</h1>
        <div class="info">
            <p class="title">Autore:</p>
            <p>Leonardo Folgoni</p>
            <p class="title">GitHub:</p>
            <p>
                <a href="http://github.com/f0lg0/stopcovid-website" target="_blank" rel="noopener noreferrer">Stop Covid Website</a>
            </p>

            <p class="title">Descrizione:</p>
            <p>
                Sito web realizzato per il progetto 'Bollettino Coronavirus'
                ideato dal prof. Gratton, Istituto Istruzione Superiore
                Capirola, Ghedi, 2021
            </p>

            <hr />

            <h2>Dati utilizzati</h2>
            <p class="title">Fonte:</p>
            <p>
                <a href="https://github.com/pcm-dpc/COVID-19" target="_blank" rel="noopener noreferrer">PCM-DPC</a>
            </p>
            <p class="title">Popolazione d'Italia:</p>
            <p>60234639</p>

            <p class="title">Popolazione Lombardia:</p>
            <p>10002615</p>

            <p class="title">Popolazione Brescia</p>
            <p>1255437</p>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
#about {
    background-color: var(--main-red);
    width: 100%;
    height: 120vh;
    color: white;
}

#about h1 {
    text-align: center;
    padding-top: 40px;
    font-size: 40px;
}

.info {
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    justify-content: center;
    text-align: center;
}

.info p {
    margin-bottom: 10px;
}

.info h2 {
    margin-top: 30px;
}

.title {
    margin-top: 30px;
    font-weight: bold;
}

hr {
    margin-top: 40px;
    margin-bottom: 40px;
    color: white;
}

a {
    color: white;
}
</style>