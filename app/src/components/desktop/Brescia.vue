<template>
    <div id="brescia-desktop">
        <div class="cards">
            <div class="card" @click="changeChart('Incidenza')">
                <p class="name">Incidenza</p>
                <p class="amt">{{ data.incidenza }}</p>
            </div>

            <div class="card" @click="changeChart('Media positivi')">
                <p class="name">Media positivi</p>
                <p class="amt">{{ data.media_positivi }}</p>
            </div>

            <div class="card" @click="changeChart('Variazione percentuale')">
                <p class="name">Variazione percentuale</p>
                <p class="amt">
                    <span v-if="data.vpp > 0">+</span>
                    {{ data.vpp }}%
                </p>
            </div>
        </div>
        <div class="graphs">
            <div class="canva">
                <p>{{ active }}</p>

                <div class="chart-container">
                    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" :key="change" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "../Charts/Line";
export default {
    data() {
        return {
            chartdata: null,
            options: null,
            loaded: false,
            data: {
                media_deceduti: 0,
                incidenza: 0,
                media_positivi: 0,
                vpp: 0,
            },
            rawData: undefined,
            sample: undefined,
            sample_reversed: undefined,
            standarized_data: [],
            standarized_data_reversed: [],
            pop_bre: 1255437,
            change: 0,
            active: "Incidenza",
        };
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
            this.rawData.reverse();

            this.sample = this.rawData.splice(0, 100);

            this.sample_reversed = [...this.sample];
            this.sample_reversed.reverse();

            // parse due to different data format
            for (let i = 0; i < this.sample.length - 1; i++) {
                this.standarized_data.push({
                    data: this.sample[i].data,
                    nuovi_positivi:
                        this.sample[i].totale_casi -
                        this.sample[i + 1].totale_casi,
                });
            }

            this.standarized_data_reversed = [...this.standarized_data];
            this.standarized_data_reversed.reverse();

            this.init();
        } catch (err) {
            console.error(err);
        }
    },
    components: {
        LineChart,
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
                maintainAspectRatio: false,
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

                    for (let i = 0; i < 93; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 6) {
                                final.labels.push(
                                    this.standarized_data_reversed[
                                        i + j
                                    ].data.substring(5, 10)
                                );
                            }
                            tmp += this.standarized_data_reversed[i + j]
                                .nuovi_positivi;
                        }

                        final.datasets[0].data.push(Math.round(tmp / 7));
                        tmp = 0;
                    }
                    // reducing the amt of data displayed
                    final.labels.splice(0, 60);
                    final.datasets[0].data.splice(0, 60);

                    final.datasets[0].borderColor = "#713535";
                    final.datasets[0].pointBackgroundColor = "#713535";

                    break;
                }
                case "Variazione percentuale": {
                    let tmp_buf = [];
                    let tmp = 0;

                    for (let i = 0; i < 93; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 6) {
                                final.labels.push(
                                    this.standarized_data_reversed[
                                        i + j
                                    ].data.substring(5, 10)
                                );
                            }
                            tmp += this.standarized_data_reversed[i + j]
                                .nuovi_positivi;
                        }
                        tmp_buf.push(Math.round(tmp / 7));
                        tmp = 0;
                    }

                    // TODO: this works but int the first 8 iterations there will be some undefined values
                    // thanks JS for being stoopid
                    for (let i = 0; i < tmp_buf.length; i++) {
                        final.datasets[0].data.push(
                            this.calculatePosPerc(tmp_buf[i], tmp_buf[i - 7])
                        );
                    }

                    // reducing the amt of data displayed
                    final.labels.splice(0, 60);
                    final.datasets[0].data.splice(0, 60);

                    final.datasets[0].borderColor = "#713535";
                    final.datasets[0].pointBackgroundColor = "#713535";
                    break;
                }
                case "Incidenza": {
                    let tmp_buf = [];
                    let tmp = 0;

                    for (let i = 0; i < 93; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 6) {
                                final.labels.push(
                                    this.standarized_data_reversed[
                                        i + j
                                    ].data.substring(5, 10)
                                );
                            }
                            tmp += this.standarized_data_reversed[i + j]
                                .nuovi_positivi;
                        }
                        tmp_buf.push(Math.round(tmp));
                        tmp = 0;
                    }

                    // TODO: this works but int the first 8 iterations there will be some undefined values
                    // thanks JS for being stoopid
                    for (let i = 0; i < tmp_buf.length; i++) {
                        final.datasets[0].data.push(
                            this.calculateIncidenza(tmp_buf[i], tmp_buf[i - 7])
                        );
                    }

                    // reducing the amt of data displayed
                    final.labels.splice(0, 60);
                    final.datasets[0].data.splice(0, 60);

                    final.datasets[0].borderColor = "#713535";
                    final.datasets[0].pointBackgroundColor = "#713535";
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
            let totPosPerDay_1 = [];

            for (let i = 0; i < 7; i++) {
                totPosPerDay_0.push(this.standarized_data[i].nuovi_positivi);
            }

            for (let i = 7; i < 14; i++) {
                totPosPerDay_1.push(this.standarized_data[i].nuovi_positivi);
            }

            const media_pos_0 = totPosPerDay_0.reduce((a, b) => a + b, 0) / 7;
            const media_pos_1 = totPosPerDay_1.reduce((a, b) => a + b, 0) / 7;

            this.data.media_positivi = Math.round(media_pos_0);
            this.data.vpp = this.calculatePosPerc(media_pos_0, media_pos_1);
            this.data.incidenza = this.calculateIncidenza(media_pos_0 * 7);
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
};
</script>

<style scoped>
#brescia-desktop {
    display: flex;
    flex-direction: row;

    max-width: 1200px;
    margin: auto;
}

.cards {
    width: 30%;
    max-width: 325px;

    height: 600px;
    margin-left: 80px;
}

.card {
    width: 80%;
    max-width: 275px;

    height: 120px;
    background-color: white;
    margin: auto;

    border: 1px solid #e6e6e6;
    border-radius: 25px;

    padding: 20px;
    color: var(--main-red);

    margin-bottom: 20px;
    margin-top: 20px;

    box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.15);
}

.card:hover {
    border: 2px solid #e6e6e6;
}

.name {
    font-weight: normal;
    font-size: 18px;
}

.amt {
    font-weight: bold;
    font-size: 30px;
    padding-top: 10px;
}

@media screen and (max-width: 1270px) {
    .name {
        font-size: 16px;
    }

    .amt {
        font-size: 25px;
    }
}

.graphs {
    width: 70%;
    height: 710px;
}

.canva {
    width: 80%;
    max-width: 650px;

    height: 90%;

    border-radius: 25px;
    border: 1px solid #e6e6e6;
    background-color: white;

    margin: auto;
    margin-top: 20px;

    box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.15);
}

.canva p {
    font-size: 28px;
    font-weight: 600;
    padding: 20px;
    padding-left: 25px;
    color: var(--main-red);
}
.chart-container {
    height: 90%;
    width: 95%;
    margin: auto;
    margin-top: 20px;
}
</style>