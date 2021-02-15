<template>
    <div id="lombardia">
        <div class="cards">
            <div
                class="card"
                id="deceduti"
                @click="changeChart('Media deceduti')"
            >
                <p class="name">Media deceduti</p>
                <p class="amt">{{ data.deceduti }}</p>
            </div>

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
                <p class="amt">{{ data.nuovi_positivi }}</p>
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
                deceduti: 0,
                incidenza: 0,
                nuovi_positivi: 0,
                vpp: 0,
            },
            rawData: undefined,
            sample: undefined,
            latestSevenDays: undefined,
            posLatestSevenDays: undefined,
            weekBefore: undefined,
            pop_lom: 10002615,
            active: "Media positivi",
            change: 0,
        };
    },
    methods: {
        init() {
            this.sample = this.rawData.slice(280, this.rawData.length);
            const sample_len = this.sample.length;

            const cloned = [...this.sample];
            const sample_rev = [...cloned].reverse();
            const chunks = 7;

            const grouped = new Array(Math.ceil(sample_rev.length / chunks))
                .fill()
                .map(() => sample_rev.splice(0, chunks));

            if (grouped[grouped.length - 1].length != 7) grouped.pop();
            grouped.reverse();

            this.latestSevenDays = this.sample.slice(
                sample_len - 7,
                sample_len
            );
            this.weekBefore = this.sample.slice(
                sample_len - 14,
                sample_len - 7
            );

            this.$emit(
                "gotWeek",
                `${this.latestSevenDays[0].data.substring(
                    5,
                    10
                )}/${this.latestSevenDays[6].data.substring(5, 10)}`
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

            let skip = true;

            switch (this.active) {
                case "Media positivi":
                    grouped.forEach((week) => {
                        final.labels.push(
                            `${week[6].data.substring(
                                8,
                                10
                            )}/${week[6].data.substring(
                                5,
                                7
                            )}-${week[0].data.substring(
                                8,
                                10
                            )}/${week[0].data.substring(5, 7)}`
                        );

                        let totPosPerDay = [];

                        for (let i = 0; i < 7; i++) {
                            totPosPerDay.push(week[i].nuovi_positivi);
                            1;
                        }

                        final.datasets[0].data.push(
                            Math.round(
                                totPosPerDay.reduce((a, b) => a + b, 0) / 7
                            )
                        );
                    });

                    final.datasets[0].borderColor = "#ffb259";
                    final.datasets[0].pointBackgroundColor = "#ffb259";
                    break;
                case "Variazione percentuale positivi":
                    grouped.forEach((week) => {
                        if (!skip) {
                            final.labels.push(
                                `${week[6].data.substring(
                                    8,
                                    10
                                )}/${week[6].data.substring(
                                    5,
                                    7
                                )}-${week[0].data.substring(
                                    8,
                                    10
                                )}/${week[0].data.substring(5, 7)}`
                            );
                        } else {
                            skip = false;
                        }
                    });

                    for (let i = 1; i < grouped.length; i++) {
                        let tmp = this.calculatePosPerc(
                            grouped[i],
                            grouped[i - 1]
                        );

                        final.datasets[0].data.push(tmp);
                    }

                    final.datasets[0].borderColor = "#4cb5ff";
                    final.datasets[0].pointBackgroundColor = "#4cb5ff";

                    grouped.reverse();
                    break;
                case "Incidenza":
                    grouped.forEach((week) => {
                        final.labels.push(
                            `${week[6].data.substring(
                                8,
                                10
                            )}/${week[6].data.substring(
                                5,
                                7
                            )}-${week[0].data.substring(
                                8,
                                10
                            )}/${week[0].data.substring(5, 7)}`
                        );

                        let tmp = 0;
                        week.forEach((day) => {
                            tmp += day.nuovi_positivi;
                        });

                        final.datasets[0].data.push(
                            this.calculateIncidenza(tmp)
                        );
                    });

                    final.datasets[0].borderColor = "#4cd97b";
                    final.datasets[0].pointBackgroundColor = "#4cd97b";
                    break;
                case "Media deceduti":
                    grouped.forEach((week) => {
                        final.labels.push(
                            `${week[6].data.substring(
                                8,
                                10
                            )}/${week[6].data.substring(
                                5,
                                7
                            )}-${week[0].data.substring(
                                8,
                                10
                            )}/${week[0].data.substring(5, 7)}`
                        );

                        let totDecPerDay = [];

                        for (let i = 0; i < 7; i++) {
                            if (i >= 1) {
                                totDecPerDay.push(
                                    week[i].deceduti - week[i - 1].deceduti
                                );
                            }
                        }

                        // abs because grouped is inversed (0 is latest, 1 is day before)
                        // work smarter not harder xD
                        final.datasets[0].data.push(
                            Math.abs(
                                Math.round(
                                    totDecPerDay.reduce((a, b) => a + b, 0) / 7
                                )
                            )
                        );
                    });

                    final.datasets[0].borderColor = "#ff5959";
                    final.datasets[0].pointBackgroundColor = "#ff5959";
                    break;
                default:
                    console.error("The provided option doesn't exist");
                    break;
            }

            this.chartdata = final;
            this.loaded = true;
        },
        formatData() {
            let totPosPerDay = [];
            let totDecPerDay = [];

            for (let i = 0; i < 7; i++) {
                totPosPerDay.push(this.latestSevenDays[i].nuovi_positivi);
                if (i >= 1) {
                    totDecPerDay.push(
                        this.latestSevenDays[i].deceduti -
                            this.latestSevenDays[i - 1].deceduti
                    );
                }
            }

            this.data.nuovi_positivi = Math.round(
                totPosPerDay.reduce((a, b) => a + b, 0) / 7
            );
            this.data.deceduti = Math.round(
                totDecPerDay.reduce((a, b) => a + b, 0) / 7
            );

            this.data.vpp = this.calculatePosPerc(
                this.latestSevenDays,
                this.weekBefore
            );
            this.data.incidenza = this.calculateIncidenza(
                totPosPerDay.reduce((a, b) => a + b, 0)
            );
        },
        calculatePosPerc(week0, week1) {
            let pos0 = 0;
            let pos1 = 0;

            for (let i = 0; i < week0.length; i++) {
                pos0 += week0[i].nuovi_positivi;
                pos1 += week1[i].nuovi_positivi;
            }

            const diff = pos0 - pos1;
            return ((diff * 100) / pos1).toFixed(2);
        },
        calculateIncidenza(pos_latest_week) {
            return ((pos_latest_week * 100000) / this.pop_lom).toFixed(2);
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
                "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json"
            );

            const json = await res.json();

            let tmp_buf = [];

            // keeping only Lombardia
            json.forEach((r) => {
                if (r.codice_regione == 3) {
                    tmp_buf.push(r);
                }
            });

            this.rawData = tmp_buf;
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