<template>
    <div id="chiamate" v-if="loaded">
        <div class="banner">
            <h1>Chiamate al 118</h1>
            <h2>Media 7g</h2>

            <div id="switcher">
                <div class="option" @click="setActive(1)" :class="{ activeOp: active1 }">
                    <p>Lombardia</p>
                </div>
                <div class="option" @click="setActive(2)" :class="{ activeOp: active2 }">
                    <p>Area Alpina</p>
                </div>
            </div>

            <div class="spiegazione">
                <div class="left">
                    <h2>Lombardia</h2>
                    <p>Tutta la regione Lombarda</p>
                </div>
                <div class="right">
                    <h2>Area Alpina</h2>
                    <p>Zona di Brescia, Bergamo e Sondrio</p>
                </div>
            </div>

            <div class="data">
                <div class="label">
                    <p>{{ data[data.length-1][0] }}</p>
                </div>
                <div class="number">
                    <p>{{ chartdata.datasets[0].data[chartdata.datasets[0].data.length-1]}}</p>
                </div>
            </div>
        </div>
        <div v-if="$store.getters.mobile" class="chart-container">
            <div class="wrapper">
                <LineChart v-if="loaded" :chartdata="chartdata" :options="options" :key="change" />
            </div>
        </div>
        <div v-else>
            <div class="chart-desktop">
                <div class="chart">
                    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" :key="change" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "../components/Charts/Line.vue";

export default {
    data() {
        return {
            data: undefined,
            header: undefined,
            chartdata: undefined,
            options: undefined,
            loaded: false,
            change: 0,

            active1: true,
            active2: false,
        };
    },
    async created() {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/Paulsword/PilloleOttimismo/main/Chiamate118.csv"
            );
            const text = await res.text();

            // parse
            this.data = this.parse(text);

            // clean
            let i = this.data.length - 1;
            while (this.data[i][0] === "") {
                this.data.pop();
                i--;
            }

            this.data.splice(0, 370);
            this.header = this.data[0];

            this.plot(false);
            this.loaded = true;
        } catch (err) {
            console.error(err);
        }
    },
    components: {
        LineChart,
    },
    methods: {
        // pass true for Area Alpina
        plot: function (flag) {
            this.change++;

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

            const options = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks: {
                                fontColor: "#000000",
                                fontSize: 12,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks: {
                                fontColor: "#000000",
                                fontSize: 12,
                            },
                        },
                    ],
                },
                legend: {
                    display: false,
                },
            };

            for (let i = 1; i < this.data.length; i++) {
                final.labels.push(this.data[i][0]);
                if (flag) {
                    final.datasets[0].data.push(this.data[i][1]);
                } else {
                    final.datasets[0].data.push(
                        parseInt(this.data[i][1]) +
                            parseInt(this.data[i][2]) +
                            parseInt(this.data[i][3]) +
                            parseInt(this.data[i][4])
                    );
                }
            }

            final.datasets[0].borderColor = "#713535";
            final.datasets[0].pointBackgroundColor = "#713535";

            this.chartdata = final;
            this.options = options;
        },
        parse: function (csv, reviver) {
            reviver =
                reviver ||
                function (r, c, v) {
                    return v;
                };
            let chars = csv.split(""),
                c = 0,
                cc = chars.length,
                start,
                end,
                table = [],
                row;
            while (c < cc) {
                table.push((row = []));
                while (c < cc && "\r" !== chars[c] && "\n" !== chars[c]) {
                    start = end = c;
                    if ('"' === chars[c]) {
                        start = end = ++c;
                        while (c < cc) {
                            if ('"' === chars[c]) {
                                if ('"' !== chars[c + 1]) {
                                    break;
                                } else {
                                    chars[++c] = ""; // unescape ""
                                }
                            }
                            end = ++c;
                        }
                        if ('"' === chars[c]) {
                            ++c;
                        }
                        while (
                            c < cc &&
                            "\r" !== chars[c] &&
                            "\n" !== chars[c] &&
                            "," !== chars[c]
                        ) {
                            ++c;
                        }
                    } else {
                        while (
                            c < cc &&
                            "\r" !== chars[c] &&
                            "\n" !== chars[c] &&
                            "," !== chars[c]
                        ) {
                            end = ++c;
                        }
                    }
                    row.push(
                        reviver(
                            table.length - 1,
                            row.length,
                            chars.slice(start, end).join("")
                        )
                    );
                    if ("," === chars[c]) {
                        ++c;
                    }
                }
                if ("\r" === chars[c]) {
                    ++c;
                }
                if ("\n" === chars[c]) {
                    ++c;
                }
            }
            return table;
        },
        setActive(op) {
            if (op == 1 && this.active1 == false) {
                this.active1 = true;
                this.active2 = false;
                this.plot(false);
            } else if (op == 2 && this.active2 == false) {
                this.active1 = false;
                this.active2 = true;
                this.plot(true);
            }
        },
    },
};
</script>

<style scoped>
#chiamate {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--main-red);
    width: 100%;
}
.banner {
    width: 100%;
    height: 300px;
    margin: auto;
    margin-top: 50px;

    text-align: center;
    color: white;
    font-size: 20px;
}

.banner h2 {
    font-weight: 100;
    font-size: 25px;
}

/* SWITCHER */
#switcher {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    background: var(--main-red);
    height: 60px;
    border: 1px solid white;
    border-radius: 40px;

    max-width: 600px;
    width: 80%;

    margin: auto;
    margin-top: 50px;
}

.option {
    padding: 10px;
    width: 45%;
    border-radius: 40px;
}

.option p {
    text-align: center;
    color: #fff;
    font-size: 16px;
}

.activeOp {
    background: #fff;
}

.activeOp p {
    color: var(--main-red);
}

/* */

.chart-container {
    height: calc(100vh - 420px);
    width: 100%;
    margin: auto;
    margin-top: 230px;
    background-color: #fff;
    border-radius: 40px 40px 0 0;
}

@media screen and (max-width: 440px) {
    .chart-container {
        margin-top: 280px;
    }
}

.wrapper {
    margin: auto;
    margin-top: 40px;
    width: 97%;
    height: 100%;
}

.data {
    display: flex;
    flex-direction: column;
    width: 90%;

    text-align: center;

    margin: auto;
    margin-top: 40px;

    width: 40%;
    height: 100px;
    border-radius: 18px;
}

.label {
    font-weight: 200;
}

.number {
    font-weight: 700;
    font-size: 46px;
}

.chart-desktop {
    background-color: white;
    width: 80%;
    max-width: 1000px;
    height: 600px;
    border-radius: 25px;
    margin: auto;

    margin-top: 250px;
    margin-bottom: 50px;
}

.chart {
    height: 100%;
    width: 95%;
    margin: auto;
    padding-top: 50px;
}

.spiegazione {
    width: 80%;
    margin: auto;
    margin-top: 100px;

    display: flex;
    flex-direction: row;

    text-align: center;
    color: white;
}

@media screen and (max-width: 760px) {
    .spiegazione {
        margin-top: 50px;
    }
}

.left,
.right {
    width: 100%;
    height: 100%;
}

.left {
    margin-right: 30px;
}

.right {
    margin-left: 30px;
}

.left h2,
.right h2 {
    font-size: 25px;
    font-weight: 600;
}

.left p,
.right p {
    font-size: 18px;
    font-weight: 200;
}
</style>