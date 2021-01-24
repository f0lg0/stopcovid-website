<template>
    <div id="home">
        <h1>Home</h1>
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
.chart {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
}
</style>
