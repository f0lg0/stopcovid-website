<template>
    <div id="chiamate">
        <div class="placeholder">
            <h1>Chiamate al 118</h1>
        </div>
        <div class="chart-container">
            <LineChart v-if="loaded" :chartdata="chartdata" :options="options" :key="change" />
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

            this.plot();
            this.loaded = true;
        } catch (err) {
            console.error(err);
        }
    },
    components: {
        LineChart,
    },
    methods: {
        plot: function () {
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
                maintainAspectRatio: true,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks: {
                                fontColor: "f1f1f1",
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
                                fontColor: "f1f1f1",
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
                final.datasets[0].data.push(this.data[i][1]);
            }

            final.datasets[0].borderColor = "#f1f1f1";
            final.datasets[0].pointBackgroundColor = "#f1f1f1";

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
    },
};
</script>

<style scoped>
#chiamate {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--main-color);
    width: 100%;
    height: 100vh;
}
.placeholder {
    width: 100%;
    height: 100px;
    margin: auto;
    margin-top: 50px;
    margin-bottom: 100px;

    text-align: center;
    color: white;
    font-size: 20px;
}
.chart-container {
    height: 90%;
    width: 95%;
    margin: auto;
    margin-top: 20px;
    background-color: var(--main-color);
}
</style>