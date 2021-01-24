<template>
    <div id="home">
        <div class="head">
            <h1>Bollettino Covid-19</h1>
            <p>Grafici giornalieri</p>
        </div>
        <div class="chart">
            <GeneralChartContainer />
        </div>
    </div>
</template>

<script>
import GeneralChartContainer from "../components/Charts/General/GeneralChartContainer.vue";

export default {
    name: "Home",
    components: {
        GeneralChartContainer
    }
};
</script>

<style scoped>
#home {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.head {
    border-left: none;
    border-right: none;
    border-bottom: 1px solid black;
    text-align: center;
    line-height: 50px;
    padding: 0 25px;
    width: 80%;
    height: 250px;
    margin: 0 auto;
    margin-bottom: 100px;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
}
.head h1 {
    padding: 0;
    line-height: 1.25;
    font-size: 32px;
    font-weight: 600;
    text-align: center;
}

.head p {
    font-style: italic;
}
.chart {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
}
</style>
