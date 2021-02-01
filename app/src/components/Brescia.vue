<template>
    <div id="brescia">
        <div class="cards">
            <div class="card" id="incidenza" @click="changeChart('Incidenza')">
                <p class="name">Incidenza <span>(Oggi)</span></p>
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
            latestWeek: undefined,
            nuovi_pos_per_week: undefined,
            latestSevenDays: undefined,
            posLatestSevenDays: undefined,
            pop_bre: 1255437,
            active: "Nuovi positivi",
            change: 0,
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
            this.sample.forEach((week) => {
                // we avoid pushing the non-finished week
                if (week.length == 7) {
                    // pos
                    let tmp_pos = 0;
                    for (let i = 0; i < week.length - 1; i++) {
                        tmp_pos +=
                            week[i + 1].totale_casi - week[i].totale_casi;
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
                        positivi: tmp_pos,
                    });
                }
            });

            this.nuovi_pos_per_week = nuovi_pos_per_week;
            this.latestSevenDays = this.sample[this.sample.length - 2].slice(
                this.sample[this.sample.length - 1].length,
                7
            );

            for (
                let i = 0;
                i < this.sample[this.sample.length - 1].length;
                i++
            ) {
                this.latestSevenDays.push(
                    this.sample[this.sample.length - 1][i]
                );
            }
            this.posLatestSevenDays = 0;
            for (let i = 0; i < 6; i++) {
                this.posLatestSevenDays +=
                    this.latestSevenDays[i + 1].totale_casi -
                    this.latestSevenDays[i].totale_casi;
            }

            this.latestWeek =
                nuovi_pos_per_week[nuovi_pos_per_week.length - 1].week;
            this.$emit("gotWeek", this.latestWeek);

            this.formatLatestWeek(
                this.nuovi_pos_per_week[nuovi_pos_per_week.length - 1],
                this.nuovi_pos_per_week[nuovi_pos_per_week.length - 2],
                this.posLatestSevenDays
            );

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

                    for (let i = 2; i < nuovi_pos_per_week.length; i++) {
                        final.datasets[0].data.push(
                            this.calculatePosPerc(
                                nuovi_pos_per_week[i],
                                nuovi_pos_per_week[i - 1]
                            )
                        );
                    }

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
            this.data.nuovi_positivi = totPos;
            this.data.vpp = this.calculatePosPerc(latestWeek, weekBefore);
            this.data.incidenza = this.calculateIncidenza(totPos);
        },
        calculatePosPerc(week0, week1) {
            let pos0 = week0.positivi;
            let pos1 = week1.positivi;

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