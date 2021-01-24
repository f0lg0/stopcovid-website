<template>
    <div class="container">
        <GeneralChart v-if="loaded" :chartdata="chartdata" :options="options" />
    </div>
</template>

<script>
import GeneralChart from "./GeneralChart.vue";

export default {
    name: "GeneralChartContainer",
    components: { GeneralChart },
    data: () => ({
        loaded: false,
        chartdata: null,
        options: null
    }),
    async mounted() {
        this.loaded = false;
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json"
            );

            const json = await res.json();
            const data = json[0];

            console.log(data);

            const parsed = {
                terapia_intensiva: data.terapia_intensiva,
                deceduti: data.deceduti,
                dimessi_guariti: data.dimessi_guariti,
                isolamento_domiciliare: data.isolamento_domiciliare,
                nuovi_positivi: data.nuovi_positivi,
                ricoverati_con_sintomi: data.ricoverati_con_sintomi,
                tamponi: data.tamponi,
                ingressi_terapia_intensiva: data.ingressi_terapia_intensiva
            };

            const parsed_keys = Object.keys(parsed);
            const final = {
                labels: [],
                datasets: [
                    {
                        label: "Totale",
                        data: [],
                        backgroundColor: [
                            "#264653",
                            "#2A9D8F",
                            "#E9C46A",
                            "#F4A261",
                            "#E76F51",
                            "#e63946",
                            "#e5989b",
                            "#2d6a4f"
                        ]
                    }
                ]
            };

            parsed_keys.forEach(key => {
                final.labels.push(key);
                final.datasets[0].data.push(parsed[key]);
            });

            this.options = { responsive: true, maintainAspectRatio: false };
            this.chartdata = final;

            this.loaded = true;
        } catch (e) {
            console.error(e);
        }
    }
};
</script>

<style scoped>
.container {
    width: 80%;
    height: 100%;
    margin: auto;
}
</style>