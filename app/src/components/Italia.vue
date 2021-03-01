<template>
    <div id="italia">
        <div class="cards">
            <div class="card" id="deceduti" @click="changeChart('Media deceduti')">
                <p class="name">Media deceduti</p>
                <p class="amt">{{ data.deceduti }}</p>
            </div>

            <div class="card" id="incidenza" @click="changeChart('Incidenza')">
                <p class="name">Incidenza</p>
                <p class="amt">{{ data.incidenza }}</p>
            </div>

            <div class="card" id="nuovipos" @click="changeChart('Media positivi')">
                <p class="name">Media positivi</p>
                <p class="amt">{{ data.nuovi_positivi }}</p>
            </div>

            <div class="card" id="varperpos" @click="changeChart('Variazione percentuale positivi')">
                <p class="name">% Positivi</p>
                <p class="amt">
                    <span v-if="data.vpp > 0">+</span>
                    {{ data.vpp }}%
                </p>
            </div>
        </div>
        <div class="chart">
            <p>{{ active }}</p>
            <div class="chart-container">
                <LineChart v-if="loaded" :chartdata="chartdata" :options="options" :key="change" />
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "./Charts/Line.vue";

export default {
    components: {
        LineChart,
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
                vpp: 0,
            },
            rawData: undefined,
            sample: undefined,
            sample_reversed: undefined,
            pop_ita: 60234639,
            active: "Media positivi",
            change: 0,
        };
    },
    methods: {
        init() {
            this.$emit(
                "gotWeek",
                `${this.sample[6].data.substring(
                    8,
                    10
                )}/${this.sample[6].data.substring(
                    5,
                    7
                )}-${this.sample[0].data.substring(
                    8,
                    10
                )}/${this.sample[0].data.substring(5, 7)}`
            );

            this.formatData();

            const final = {
                labels: [],
                datasets: [
                    {
                        pointRadius: 5,
                        fill: false,
                        data: [],
                    },
                ],
            };

            this.options = {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                        },
                    ],
                },
                legend: {
                    display: false,
                },
            };

            switch (this.active) {
                case "Media positivi": {
                    let tmp = 0;

                    for (let i = 0; i < 92; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 6) {
                                final.labels.push(
                                    this.sample_reversed[i + j].data.substring(
                                        5,
                                        10
                                    )
                                );
                            }
                            tmp += this.sample_reversed[i + j].nuovi_positivi;
                        }

                        final.datasets[0].data.push(Math.round(tmp / 7));
                        tmp = 0;
                    }

                    // reducing the amt of data displayed
                    final.labels.splice(0, 60);
                    final.datasets[0].data.splice(0, 60);

                    final.datasets[0].borderColor = "#ffb259";
                    final.datasets[0].pointBackgroundColor = "#ffb259";
                    break;
                }
                case "Variazione percentuale positivi": {
                    let pos_per_day = [];
                    let tmp_buf = [];

                    for (let i = 0; i < this.sample_reversed.length; i++) {
                        if (
                            (i == 0 || i % 7 == 0) &&
                            i + 6 < this.sample_reversed.length
                        ) {
                            final.labels.push(
                                `${this.sample_reversed[i].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i].data.substring(
                                    5,
                                    7
                                )}-${this.sample_reversed[i + 6].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i + 6].data.substring(
                                    5,
                                    7
                                )}`
                            );
                        }

                        pos_per_day.push(
                            this.sample_reversed[i].nuovi_positivi
                        );
                    }

                    final.labels.shift();

                    let tmp = 0;
                    for (let i = 0; i < pos_per_day.length; i++) {
                        if (i != 0 && i % 7 == 0) {
                            tmp_buf.push(Math.round(tmp / 7));
                            tmp = 0;
                        }
                        tmp += pos_per_day[i];
                    }

                    tmp_buf.push(Math.round(tmp / 7));

                    for (let i = 1; i < tmp_buf.length; i++) {
                        final.datasets[0].data.push(
                            this.calculatePosPerc(tmp_buf[i], tmp_buf[i - 1])
                        );
                    }

                    final.datasets[0].borderColor = "#4cb5ff";
                    final.datasets[0].pointBackgroundColor = "#4cb5ff";
                    break;
                }
                case "Incidenza": {
                    let tmp = 0;
                    for (let i = 0; i < this.sample_reversed.length; i++) {
                        if (
                            (i == 0 || i % 7 == 0) &&
                            i + 6 < this.sample_reversed.length
                        ) {
                            final.labels.push(
                                `${this.sample_reversed[i].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i].data.substring(
                                    5,
                                    7
                                )}-${this.sample_reversed[i + 6].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i + 6].data.substring(
                                    5,
                                    7
                                )}`
                            );
                        }

                        if (i != 0 && i % 7 == 0) {
                            final.datasets[0].data.push(
                                this.calculateIncidenza(tmp)
                            );
                            tmp = 0;
                        }
                        tmp += this.sample_reversed[i].nuovi_positivi;
                    }

                    final.datasets[0].data.push(this.calculateIncidenza(tmp));

                    final.datasets[0].borderColor = "#4cd97b";
                    final.datasets[0].pointBackgroundColor = "#4cd97b";
                    break;
                }
                case "Media deceduti": {
                    let tmp = 0;
                    let dec_per_day = [];

                    for (let i = 0; i < this.sample_reversed.length - 1; i++) {
                        if (
                            (i == 0 || i % 7 == 0) &&
                            i + 6 < this.sample_reversed.length
                        ) {
                            final.labels.push(
                                `${this.sample_reversed[i].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i].data.substring(
                                    5,
                                    7
                                )}-${this.sample_reversed[i + 6].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i + 6].data.substring(
                                    5,
                                    7
                                )}`
                            );
                        }

                        dec_per_day.push(
                            this.sample_reversed[i + 1].deceduti -
                                this.sample_reversed[i].deceduti
                        );
                    }

                    for (let i = 0; i < dec_per_day.length; i++) {
                        if (i % 7 == 0) {
                            final.datasets[0].data.push(Math.round(tmp / 7));
                            tmp = 0;
                        }
                        tmp += dec_per_day[i];
                    }

                    final.datasets[0].data.push(Math.round(tmp / 7));
                    final.datasets[0].data.shift();

                    final.datasets[0].borderColor = "#ff5959";
                    final.datasets[0].pointBackgroundColor = "#ff5959";
                    break;
                }
                default:
                    console.error("The provided option doesn't exist");
                    break;
            }

            this.chartdata = final;
            this.loaded = true;
        },
        formatData() {
            let totPosPerDay_0 = [];
            let totDecPerDay_0 = [];

            let totPosPerDay_1 = [];
            let totDecPerDay_1 = [];

            for (let i = 0; i < 7; i++) {
                totPosPerDay_0.push(this.sample[i].nuovi_positivi);
                if (i >= 1) {
                    totDecPerDay_0.push(
                        this.sample[i].deceduti - this.sample[i - 1].deceduti
                    );
                }
            }

            for (let i = 7; i < 14; i++) {
                totPosPerDay_1.push(this.sample[i].nuovi_positivi);
                if (i >= 1) {
                    totDecPerDay_1.push(
                        this.sample[i].deceduti - this.sample[i - 1].deceduti
                    );
                }
            }

            const media_pos_0 = totPosPerDay_0.reduce((a, b) => a + b, 0) / 7;
            const media_pos_1 = totPosPerDay_1.reduce((a, b) => a + b, 0) / 7;

            this.data.nuovi_positivi = Math.round(media_pos_0);
            this.data.deceduti = Math.abs(
                Math.round(totDecPerDay_0.reduce((a, b) => a + b, 0) / 7)
            );

            this.data.vpp = this.calculatePosPerc(media_pos_0, media_pos_1);
            this.data.incidenza = this.calculateIncidenza(media_pos_0 * 7);
        },
        calculatePosPerc(pos0, pos1) {
            const diff = pos0 - pos1;
            return ((diff * 100) / pos1).toFixed(2);
        },
        calculateIncidenza(pos_latest_week) {
            return ((pos_latest_week * 100000) / this.pop_ita).toFixed(2);
        },

        changeChart(c) {
            if (this.active != c) {
                this.active = c;
                this.change += 1;
                this.init();
            }
        },
    },
    async mounted() {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
            );

            const json = await res.json();
            this.rawData = json;
            this.rawData.reverse();

            this.sample = this.rawData.splice(0, 98);

            this.sample_reversed = [...this.sample];
            this.sample_reversed.reverse();

            this.init();
        } catch (err) {
            console.error(err);
        }
    },
};
</script>

<style scoped>
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

.card:hover {
    border: 2px solid transparent;
}

.card p {
    padding: 9%;
}

.name {
    font-weight: 600;
}

/* .name span {
    font-size: 12px;
    font-weight: 300;
} */

.amt {
    font-size: 26px;
    font-weight: 700;
}

@media screen and (max-width: 365px) {
    .card {
        width: 140px;
        height: 110px;
    }

    .name {
        font-size: 14px;
    }
    .amt {
        font-size: 23px;
    }
}

@media screen and (min-width: 480px) {
    .card {
        width: 200px;
        height: 130px;
    }
}

@media screen and (min-width: 590px) {
    .card {
        width: 230px;
        height: 140px;
    }
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