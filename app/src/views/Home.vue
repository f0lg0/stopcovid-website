<template>
    <div id="home">
        <div class="banner flex-col-cent">
            <div class="banner-container">
                <h1>Covid-19</h1>
                <h2>
                    Settimana <span>{{ latestWeek }}</span>
                </h2>

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

                    <div
                        class="card"
                        id="incidenza"
                        @click="changeChart('Incidenza')"
                    >
                        <p class="name">Incidenza</p>
                        <p class="amt">{{ data.incidenza }}</p>
                    </div>

                    <div
                        class="card"
                        id="nuovipos"
                        @click="changeChart('Nuovi positivi')"
                    >
                        <p class="name">Positivi</p>
                        <p class="amt">{{ data.nuovi_positivi }}</p>
                    </div>

                    <div
                        class="card"
                        id="varperpos"
                        @click="changeChart('Variazione percentuale positivi')"
                    >
                        <p class="name">% Positivi</p>
                        <p class="amt">{{ data.vpp }}%</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="chart">
            <p>{{ active }}</p>
            <div class="chart-container">
                <LineChart
                    v-if="loaded"
                    :chartdata="chartdata"
                    :options="options"
                    :key="change"
                />
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "../components/Charts/Line.vue";
import Switcher from "../components/Switcher.vue";

export default {
    name: "Home",
    components: {
        LineChart,
        Switcher
    },
    data() {
        return {
            chartdata: null,
            options: null,
            loaded: false,
            data: {
                deceduti: 0,
                incidenza: 0,
                nuovi_positivi: 0,
                vpp: 0
            },
            rawData: undefined,
            sample: undefined,
            latestWeek: undefined,
            nuovi_pos_per_week: undefined,
            pop_ita: 60234639,
            active: "Nuovi positivi",
            change: 0
        };
    },
    methods: {
        init() {
            // the sample consits of 100 days starting from the latest going backwards
            this.sample = this.rawData.slice(237, this.rawData.length);
            const chunks = 7;

            const result = new Array(Math.ceil(this.sample.length / chunks))
                .fill()
                .map(() => this.sample.splice(0, chunks));

            this.sample = result;

            let nuovi_pos_per_week = [];
            this.sample.forEach(week => {
                // we avoid pushing the non-finished week
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

            this.latestWeek =
                nuovi_pos_per_week[nuovi_pos_per_week.length - 1].week;
            if (this.sample[sample_len - 1].length == 7) {
                this.formatLatestWeek(
                    this.sample[sample_len - 1],
                    this.sample[sample_len - 2],
                    nuovi_pos_per_week[nuovi_pos_per_week.length - 1].positivi
                );

                this.data.vpp = this.calculatePosPerc(
                    this.sample[sample_len - 1],
                    this.sample[sample_len - 2]
                );

                this.data.incidenza = this.calculateIncidenza(
                    nuovi_pos_per_week[nuovi_pos_per_week.length - 1].positivi
                );
            } else {
                this.formatLatestWeek(
                    this.sample[sample_len - 2],
                    this.sample[sample_len - 3],
                    nuovi_pos_per_week[nuovi_pos_per_week.length - 1].positivi
                );

                this.data.vpp = this.calculatePosPerc(
                    this.sample[sample_len - 2],
                    this.sample[sample_len - 3]
                );

                this.data.incidenza = this.calculateIncidenza(
                    nuovi_pos_per_week[nuovi_pos_per_week.length - 1].positivi
                );
            }

            const final = {
                labels: [],
                datasets: [
                    {
                        pointRadius: 5,
                        fill: false,
                        data: []
                    }
                ]
            };

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

            let tmp_buf = [];

            switch (this.active) {
                case "Nuovi positivi":
                    for (let i = 0; i < nuovi_pos_per_week.length; i++) {
                        final.labels.push(nuovi_pos_per_week[i].week);
                        final.datasets[0].data.push(
                            nuovi_pos_per_week[i].positivi
                        );
                    }

                    final.datasets[0].borderColor = "#ffb259";
                    final.datasets[0].pointBackgroundColor = "#ffb259";

                    break;
                case "Variazione percentuale positivi":
                    for (let i = 2; i < nuovi_pos_per_week.length; i++) {
                        final.labels.push(nuovi_pos_per_week[i].week);
                    }

                    for (let i = sample_len - 1; i > 0; i--) {
                        let tmp = this.calculatePosPerc(
                            this.sample[i],
                            this.sample[i - 1]
                        );

                        tmp_buf.push(tmp);
                    }

                    tmp_buf.pop();
                    tmp_buf.reverse();
                    tmp_buf.pop();

                    final.datasets[0].data = tmp_buf;

                    // clearing for future use
                    tmp_buf = [];

                    final.datasets[0].borderColor = "#4cb5ff";
                    final.datasets[0].pointBackgroundColor = "#4cb5ff";
                    break;
                case "Incidenza":
                    for (let i = 0; i < nuovi_pos_per_week.length; i++) {
                        final.labels.push(nuovi_pos_per_week[i].week);
                        final.datasets[0].data.push(
                            this.calculateIncidenza(
                                nuovi_pos_per_week[i].positivi
                            )
                        );
                    }

                    final.datasets[0].borderColor = "#4cd97b";
                    final.datasets[0].pointBackgroundColor = "#4cd97b";
                    break;
                default:
                    console.error("The provided option doesn't exist");
                    break;
            }

            this.chartdata = final;
            this.loaded = true;
        },
        formatLatestWeek(latestWeek, weekBefore, totPos) {
            const len = latestWeek.length;

            this.data.deceduti =
                latestWeek[len - 1].deceduti - latestWeek[0].deceduti;
            this.data.nuovi_positivi = totPos;
            this.data.vpp = this.calculatePosPerc(latestWeek, weekBefore);
            this.data.incidenza = this.calculateIncidenza(totPos);
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
        calculateIncidenza(pos_latest_week) {
            return Math.round((pos_latest_week * 100000) / this.pop_ita);
        },
        formatTotale(rawData) {
            console.log(rawData);
        },
        switched(op) {
            if (op == 1) {
                if (this.sample[this.sample.length - 1].length == 7) {
                    this.formatLatestWeek(
                        this.sample[this.sample.length - 1],
                        this.sample[this.sample.length - 2],
                        this.nuovi_pos_per_week[
                            this.nuovi_pos_per_week.length - 1
                        ].positivi
                    );
                } else {
                    this.formatLatestWeek(
                        this.sample[this.sample.length - 2],
                        this.sample[this.sample.length - 3],
                        this.nuovi_pos_per_week[
                            this.nuovi_pos_per_week.length - 1
                        ].positivi
                    );
                }
            } else if (op == 2) {
                this.formatTotale(this.rawData);
            }
        },
        changeChart(c) {
            if (this.active != c) {
                this.active = c;
                this.change += 1;
                this.init();
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

            this.init();
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

.banner-container h2 span {
    font-weight: 400;
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
    cursor: pointer;
}

.card:hover {
    border: 2px solid transparent;
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

#incidenza {
    background-color: #4cd97b;
}

#varperpos {
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
    margin-top: 115px;
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
