<template>
    <div id="home">
        <div class="updates_container" v-if="!clicked">
            <Updates text="Miglioramento delle prestazioni" />
        </div>
        <div class="banner flex-col-cent">
            <div class="banner-container">
                <h1>Covid-19</h1>
                <h2>
                    Settimana
                    <span>{{ latestWeek }}</span>
                </h2>
                <div class="switcher-container">
                    <Switcher op1="Italia" op2="Lombardia" op3="Brescia" v-on:switched="switched($event)" />
                </div>
            </div>
            <Italia v-if="selected == 'Italia'" v-on:gotWeek="latestWeek = $event" />

            <Lombardia v-if="selected == 'Lombardia'" v-on:gotWeek="latestWeek = $event" />

            <Brescia v-if="selected == 'Brescia'" v-on:gotWeek="latestWeek = $event" />
        </div>
    </div>
</template>

<script>
import Switcher from "../components/Switcher.vue";
import Updates from "../components/Updates.vue";
import Italia from "../components/Italia.vue";
import Lombardia from "../components/Lombardia.vue";
import Brescia from "../components/Brescia.vue";

export default {
    name: "Home",
    components: {
        Switcher,
        Updates,
        Italia,
        Lombardia,
        Brescia,
    },
    data() {
        return {
            latestWeek: "...",
            selected: "Italia",
            clicked: true,
        };
    },
    methods: {
        switched(op) {
            if (op == 1 && this.selected != "Italia") {
                this.selected = "Italia";
            } else if (op == 2 && this.selected != "Lombardia") {
                this.selected = "Lombardia";
            } else if (op == 3 && this.selected != "Brescia") {
                this.selected = "Brescia";
            }
        },
    },
};
</script>
<style scoped>
#home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--main-color);
}

.updates_container {
    width: 80%;
    height: 80px;
    margin: auto;
    margin-top: 50px;
}

.banner {
    width: 100%;
    height: 72vh;
    /* hacky */
    margin-top: 200px;
}

@media screen and (max-width: 280px) {
    .banner {
        margin-top: 330px;
    }
}

.banner-container {
    width: 90%;
    height: 80%;
    margin: auto;
}

.banner-container h1 {
    color: #f2f2f2;
    padding-left: 3%;
    font-size: 40px;
}

.banner-container h2 {
    color: #f2f2f2;
    padding-left: 3%;
    margin-top: 20px;
    font-size: 20px;
    font-weight: 200;
}

.banner-container h2 span {
    font-weight: 400;
}

.switcher-container {
    margin-top: 60px;
    margin-bottom: 50px;
}
</style>
