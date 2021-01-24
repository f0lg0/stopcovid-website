<template>
    <div id="home">
        <div class="banner flex-col-cent">
            <div class="banner-container">
                <h1>Covid-19</h1>

                <div class="switcher-container">
                    <Switcher op1="Oggi" op2="Totale" />
                </div>

                <div class="cards">
                    <div class="card" id="deceduti">
                        <p class="name">Deceduti</p>
                        <p class="amt">{{ data.deceduti }}</p>
                    </div>

                    <div class="card" id="guariti">
                        <p class="name">Guariti</p>
                        <p class="amt">{{ data.guariti }}</p>
                    </div>

                    <div class="card" id="nuovipos">
                        <p class="name">Positivi</p>
                        <p class="amt">{{ data.nuovi_positivi }}</p>
                    </div>

                    <div class="card" id="tamponi">
                        <p class="name">Tamponi</p>
                        <p class="amt">{{ data.tamponi }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="chart">
            <p>Trend positivi</p>
            <div class="chart-container">
                <Positivi
                    v-if="loaded"
                    :chartdata="chartdata"
                    :options="options"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Positivi from "../components/Charts/Positivi/Positivi.vue";
import Switcher from "../components/Switcher.vue";

export default {
    name: "Home",
    components: {
        Positivi,
        Switcher
    },
    data() {
        return {
            chartdata: null,
            options: null,
            loaded: false,
            data: {
                deceduti: 0,
                guariti: 0,
                nuovi_positivi: 0,
                tamponi: 0
            }
        };
    },
    async mounted() {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
            );

            const json = await res.json();
            let target = [];

            let days = 0;
            for (let i = json.length - 1; i > 0; i--) {
                target.push(json[i]);
                days += 1;

                if (days == 5) break;
            }

            const target_list = Object.keys(target);

            const final = {
                labels: [],
                datasets: [
                    {
                        label: "Positivi",
                        borderColor: "#ffb259",
                        pointBackgroundColor: "#ffb259",
                        pointRadius: 5,
                        fill: false,

                        data: []
                    }
                ]
            };

            this.data.deceduti = target[0].deceduti - target[1].deceduti;
            this.data.guariti =
                target[0].dimessi_guariti - target[1].dimessi_guariti;
            this.data.nuovi_positivi = target[0].nuovi_positivi;
            this.data.tamponi = target[0].tamponi - target[1].tamponi;

            // reversing for plotting purposes
            target = target.reverse();

            target_list.forEach(day => {
                final.labels.push(`Gen ${target[day].data.substring(8, 10)}`);
                final.datasets[0].data.push(target[day].nuovi_positivi);
            });

            this.options = {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)"
                            }
                        }
                    ]
                },
                legend: {
                    display: false
                }
            };
            this.chartdata = final;

            this.loaded = true;
        } catch (err) {
            console.error(err);
        }
    }
};
</script>

<style scoped>
#home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--main-color);
}

.banner {
    width: 100%;
    height: 72vh;
}

.banner-container {
    width: 90%;
    height: 80%;
    margin: auto;
}

.banner-container h1 {
    color: #f2f2f2;
    margin-bottom: 50px;
    padding-left: 3%;
}

.switcher-container {
    margin-top: 60px;
    margin-bottom: 50px;
}

.cards {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
}

.card {
    background-color: green;
    width: 170px;
    height: 120px;
    margin-bottom: 20px;
    border-radius: 14px;
    color: #f2f2f2;
}

.card p {
    padding: 9%;
}

.name {
    font-weight: 600;
}

.amt {
    font-size: 30px;
    font-weight: 700;
}

#nuovipos {
    background-color: #ffb259;
}

#deceduti {
    background-color: #ff5959;
}

#guariti {
    background-color: #4cd97b;
}

#tamponi {
    background-color: #4cb5ff;
}

.chart {
    width: 100%;
    height: calc(100vh - 66vh);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    border-radius: 40px 40px 0 0;
    top: 600px;
}

.chart p {
    padding-left: 30px;
    margin-top: 100px;
    margin-bottom: 10px;
    font-size: 26px;
    font-weight: 600;
}

.chart-container {
    height: 90%;
    width: 95%;
    margin: auto;
    margin-top: 20px;
}
</style>
