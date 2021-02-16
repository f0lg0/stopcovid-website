<template>
    <div id="brescia">
        <div class="cards">
            <div class="card" id="incidenza" @click="changeChart('Incidenza')">
                <p class="name">Incidenza</p>
                <p class="amt">{{ data.incidenza }}</p>
            </div>

            <div
                class="card"
                id="nuovipos"
                @click="changeChart('Media positivi')"
            >
                <p class="name">Media positivi</p>
                <p class="amt">{{ data.media_positivi }}</p>
            </div>

            <div
                class="card"
                id="varperpos"
                @click="changeChart('Variazione percentuale positivi')"
            >
                <p class="name">% Positivi</p>
                <p class="amt">
                    <span v-if="data.vpp > 0">+</span>{{ data.vpp }}%
                </p>
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
                incidenza: 0,
                media_positivi: 0,
                vpp: 0,
            },
            rawData: undefined,
            sample: undefined,
            sample_reversed: undefined,
            pop_bre: 1255437,
            active: "Media positivi",
            change: 0,
        };
    },
    methods: {
        init() {
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
                    let to_revert_labels = [];
                    let to_revert_data = [];

                    let pos_per_day = [];
                    for (let i = 0; i < this.sample_reversed.length - 1; i++) {
                        if (
                            (i == 0 || i % 7 == 0) &&
                            i + 6 < this.sample_reversed.length
                        ) {
                            to_revert_labels.push(
                                `${this.sample_reversed[i + 6].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i + 6].data.substring(
                                    5,
                                    7
                                )}-${this.sample_reversed[i].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i].data.substring(
                                    5,
                                    7
                                )}`
                            );
                        }

                        pos_per_day.push(
                            this.sample_reversed[i].totale_casi -
                                this.sample_reversed[i + 1].totale_casi
                        );
                    }

                    let tmp = 0;
                    for (let i = 0; i < pos_per_day.length; i++) {
                        if (i % 7 == 0) {
                            to_revert_data.push(Math.round(tmp / 7));
                            tmp = 0;
                        }
                        tmp += pos_per_day[i];
                    }

                    final.labels = to_revert_labels.reverse();
                    final.datasets[0].data = to_revert_data.reverse();

                    final.datasets[0].borderColor = "#ffb259";
                    final.datasets[0].pointBackgroundColor = "#ffb259";
                    break;
                }

                case "Variazione percentuale positivi": {
                    let to_revert_labels = [];
                    let to_revert_data = [];

                    let pos_per_day = [];

                    for (let i = 0; i < this.sample_reversed.length - 1; i++) {
                        if (
                            (i == 0 || i % 7 == 0) &&
                            i + 6 < this.sample_reversed.length
                        ) {
                            to_revert_labels.push(
                                `${this.sample_reversed[i + 6].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i + 6].data.substring(
                                    5,
                                    7
                                )}-${this.sample_reversed[i].data.substring(
                                    8,
                                    10
                                )}/${this.sample_reversed[i].data.substring(
                                    5,
                                    7
                                )}`
                            );
                        }

                        pos_per_day.push(
                            this.sample_reversed[i].totale_casi -
                                this.sample_reversed[i + 1].totale_casi
                        );
                    }
                    let tmp = 0;
                    for (let i = 0; i < pos_per_day.length; i++) {
                        if (i % 7 == 0) {
                            to_revert_data.push(Math.round(tmp / 7));
                            tmp = 0;
                        }
                        tmp += pos_per_day[i];
                    }

                    to_revert_labels.pop();
                    // %

                    let asdf = [];
                    for (let i = 0; i < to_revert_data.length - 1; i++) {
                        asdf.push(
                            this.calculatePosPerc(
                                to_revert_data[i],
                                to_revert_data[i + 1]
                            )
                        );
                    }

                    final.labels = to_revert_labels.reverse();
                    final.datasets[0].data = asdf.reverse();

                    final.datasets[0].borderColor = "#4cb5ff";
                    final.datasets[0].pointBackgroundColor = "#4cb5ff";

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
            let pos_per_day_0 = [];
            let pos_per_day_1 = [];

            for (let i = 0; i < 7; i++) {
                pos_per_day_0.push(
                    this.sample_reversed[i].totale_casi -
                        this.sample_reversed[i + 1].totale_casi
                );
            }

            for (let i = 7; i < 14; i++) {
                pos_per_day_1.push(
                    this.sample_reversed[i].totale_casi -
                        this.sample_reversed[i + 1].totale_casi
                );
            }

            const media_pos_0 = pos_per_day_0.reduce((a, b) => a + b, 0) / 7;
            const media_pos_1 = pos_per_day_1.reduce((a, b) => a + b, 0) / 7;

            this.data.media_positivi = Math.round(media_pos_0);

            this.data.vpp = this.calculatePosPerc(media_pos_0, media_pos_1);
            // this.data.incidenza = this.calculateIncidenza(media_pos * 7);
        },
        calculatePosPerc(pos0, pos1) {
            const diff = pos0 - pos1;
            return ((diff * 100) / pos1).toFixed(2);
        },
        calculateIncidenza(pos_latest_week) {
            return ((pos_latest_week * 100000) / this.pop_bre).toFixed(2);
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
                "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json"
            );

            const json = await res.json();

            let tmp_buf = [];

            // keeping only Lombardia
            json.forEach((r) => {
                if (r.codice_provincia == 17) {
                    tmp_buf.push(r);
                }
            });

            this.rawData = tmp_buf;
            this.sample = this.rawData.slice(280, this.rawData.length);
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

.name span {
    font-size: 12px;
    font-weight: 300;
}

.amt {
    font-size: 26px;
    font-weight: 700;
}

@media screen and (max-width: 365px) {
    .card {
        width: 140px;
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