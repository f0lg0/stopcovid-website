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
                @click="changeChart('Nuovi positivi')"
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
                incidenza: 0,
                nuovi_positivi: 0,
                vpp: 0,
            },
            rawData: undefined,
            sample: undefined,
            latestSevenDays: undefined,
            posLatestSevenDays: undefined,
            weekBefore: undefined,
            pop_bre: 1255437,
            active: "Nuovi positivi",
            change: 0,
        };
    },
    methods: {
        init() {
            this.sample = this.rawData.slice(280, this.rawData.length);
            const sample_len = this.sample.length;

            const cloned = [...this.sample];
            const sample_rev = [...cloned].reverse();
            const sample_rev_copy = [...sample_rev];

            const chunks = 7;

            const grouped = new Array(Math.ceil(sample_rev.length / chunks))
                .fill()
                .map(() => sample_rev.splice(0, chunks));

            if (grouped[grouped.length - 1].length != 7) grouped.pop();
            grouped.reverse();

            // grabbing an extra day to calculate stuff
            this.latestSevenDays = this.sample.slice(
                sample_len - 8,
                sample_len
            );

            // grabbing an extra day to calculate stuff
            this.weekBefore = this.sample.slice(
                sample_len - 15,
                sample_len - 7
            );

            this.$emit(
                "gotWeek",
                `${this.latestSevenDays[1].data.substring(
                    5,
                    10
                )}/${this.latestSevenDays[7].data.substring(5, 10)}`
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

            // this is super bad code but im not okay understand me pls
            let tmp_8 = new Array(Math.ceil(sample_rev_copy.length / 8))
                .fill()
                .map(() => sample_rev_copy.splice(0, 8));

            if (tmp_8[tmp_8.length - 1].length != 7) tmp_8.pop();
            tmp_8.reverse();

            switch (this.active) {
                case "Nuovi positivi":
                    for (let i = 35; i < sample_len; i++) {
                        final.labels.push(this.sample[i].data.substring(5, 10));
                        final.datasets[0].data.push(
                            this.sample[i].totale_casi -
                                this.sample[i - 1].totale_casi
                        );
                    }

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
                            grouped[i][0].totale_casi -
                                grouped[i][6].totale_casi,
                            grouped[i - 1][0].totale_casi -
                                grouped[i - 1][6].totale_casi
                        );

                        final.datasets[0].data.push(tmp);
                    }

                    final.datasets[0].borderColor = "#4cb5ff";
                    final.datasets[0].pointBackgroundColor = "#4cb5ff";

                    grouped.reverse();
                    skip = true;
                    break;
                case "Incidenza":
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
                    tmp_8.forEach((week) => {
                        let pos_per_day = [];
                        let media_pos = 0;

                        week.reverse();

                        for (let i = 1; i < 8; i++) {
                            pos_per_day.push(
                                week[i].totale_casi - week[i - 1].totale_casi
                            );
                        }

                        media_pos = pos_per_day.reduce((a, b) => a + b, 0) / 7;

                        final.datasets[0].data.push(
                            this.calculateIncidenza(Math.round(media_pos * 7))
                        );
                    });

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
        formatData() {
            let totPosPerDay_0 = [];

            for (let i = 1; i < 8; i++) {
                totPosPerDay_0.push(
                    this.latestSevenDays[i].totale_casi -
                        this.latestSevenDays[i - 1].totale_casi
                );
            }

            const media_pos = totPosPerDay_0.reduce((a, b) => a + b, 0) / 7;

            this.data.nuovi_positivi = Math.round(media_pos);

            this.data.vpp = this.calculatePosPerc(
                this.latestSevenDays[7].totale_casi -
                    this.latestSevenDays[1].totale_casi,
                this.weekBefore[7].totale_casi - this.weekBefore[1].totale_casi
            );
            this.data.incidenza = this.calculateIncidenza(media_pos * 7);
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