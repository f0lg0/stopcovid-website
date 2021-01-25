<template>
    <div id="home">
        <div class="banner flex-col-cent">
            <div class="banner-container">
                <h1>Covid-19</h1>
                <h2>Questa settimana</h2>

                <div class="switcher-container">
                    <Switcher
                        op1="Italia"
                        op2="Lombardia"
                        v-on:switched="switched($event)"
                    />
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
                        <p class="name">% Positivi</p>
                        <p class="amt">{{ data.vpp }}%</p>
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
                vpp: 0
            },
            rawData: undefined,
            sample: undefined,
            nuovi_pos_per_week: undefined
        };
    },
    methods: {
        formatLatestWeek(latestWeek, weekBefore, totPos) {
            const len = latestWeek.length;

            this.data.deceduti =
                latestWeek[len - 1].deceduti - latestWeek[0].deceduti;
            this.data.guariti =
                latestWeek[len - 1].dimessi_guariti -
                latestWeek[0].dimessi_guariti;
            this.data.nuovi_positivi = totPos;
            this.data.vpp = this.calculatePosPerc(latestWeek, weekBefore);
        },
        calculatePosPerc(week0, week1) {
            let pos0 = 0;
            let pos1 = 0;

            for (let i = 0; i < week0.length; i++) {
                pos0 += week0[i].nuovi_positivi;
                pos1 += week1[i].nuovi_positivi;
            }

            const diff = pos0 - pos1;
            return Math.round((diff * 100) / pos1);
        },
        formatTotale(rawData) {
            const length = rawData.length;
            this.data.deceduti = rawData[length - 1].deceduti;
            this.data.guariti = rawData[length - 1].dimessi_guariti;
            this.data.tamponi = rawData[length - 1].tamponi;

            rawData.forEach(day => {
                this.data.nuovi_positivi += day.nuovi_positivi;
            });
        },
        switched(op) {
            if (op == 1) {
                this.formatLatestWeek(
                    this.sample[this.sample.length - 2],
                    this.sample[this.sample.length - 3],
                    this.nuovi_pos_per_week[this.nuovi_pos_per_week.length - 1]
                        .positivi
                );
            } else if (op == 2) {
                this.formatTotale(this.rawData);
            }
        }
    },
    async mounted() {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
            );

            const json = await res.json();
            this.rawData = json;

            // the sample consits of 100 days starting from the latest going backwards
            this.sample = this.rawData.slice(237, this.rawData.length);
            const chunks = 7;

            const result = new Array(Math.ceil(this.sample.length / chunks))
                .fill()
                .map(() => this.sample.splice(0, chunks));

            this.sample = result;

            let nuovi_pos_per_week = [];
            this.sample.forEach(week => {
                if (week.length == 7) {
                    let tmp = 0;
                    for (let i = 0; i < week.length; i++) {
                        tmp += week[i].nuovi_positivi;
                    }
                    nuovi_pos_per_week.push({
                        week: `${week[0].data.substring(
                            8,
                            10
                        )}/${week[0].data.substring(
                            5,
                            7
                        )}-${week[6].data.substring(
                            8,
                            10
                        )}/${week[6].data.substring(5, 7)}`,
                        positivi: tmp
                    });
                }
            });

            this.nuovi_pos_per_week = nuovi_pos_per_week;
            const sample_len = this.sample.length;

            if (this.sample[sample_len - 1].length == 7) {
                this.formatLatestWeek(
                    this.sample[this.sample.length - 1],
                    this.sample[this.sample.length - 2],
                    nuovi_pos_per_week[nuovi_pos_per_week.length - 1].positivi
                );

                this.data.vpp = this.calculatePosPerc(
                    this.sample[this.sample.length - 1],
                    this.sample[this.sample.length - 2]
                );
            } else {
                this.formatLatestWeek(
                    this.sample[this.sample.length - 2],
                    this.sample[this.sample.length - 3],
                    nuovi_pos_per_week[nuovi_pos_per_week.length - 1].positivi
                );

                this.data.vpp = this.calculatePosPerc(
                    this.sample[this.sample.length - 2],
                    this.sample[this.sample.length - 3]
                );
            }

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

            for (let i = 0; i < nuovi_pos_per_week.length; i++) {
                final.labels.push(nuovi_pos_per_week[i].week);
                final.datasets[0].data.push(nuovi_pos_per_week[i].positivi);
            }

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
    padding-left: 3%;
    font-size: 40px;
}

.banner-container h2 {
    color: #f2f2f2;
    padding-left: 3%;
    margin-top: 20px;
    font-size: 20px;
    font-weight: 200;
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
    width: 165px;
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
    font-size: 26px;
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
    margin-top: 50px;
    border-radius: 40px 40px 0 0;
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
