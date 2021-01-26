<template>
    <div id="home">
        <div class="banner flex-col-cent">
            <div class="banner-container">
                <h1>Covid-19</h1>
                <h2>
                    Settimana <span>{{ latestWeek }}</span>
                </h2>
                <div class="switcher-container">
                    <Switcher
                        op1="Italia"
                        op2="Lombardia"
                        v-on:switched="switched($event)"
                    />
                </div>
            </div>
            <Italia
                v-if="selected == 'Italia'"
                v-on:gotWeek="latestWeek = $event"
            />

            <Lombardia
                v-if="selected == 'Lombardia'"
                v-on:gotWeek="latestWeek = $event"
            />
        </div>
    </div>
</template>

<script>
import Switcher from "../components/Switcher.vue";
import Italia from "../components/Italia.vue";
import Lombardia from "../components/Lombardia.vue";

export default {
    name: "Home",
    components: {
        Switcher,
        Italia,
        Lombardia
    },
    data() {
        return {
            latestWeek: "...",
            selected: "Italia"
        };
    },
    methods: {
        switched(op) {
            if (op == 1 && this.selected != "Italia") {
                this.selected = "Italia";
            } else if (op == 2 && this.selected != "Lombardia") {
                this.selected = "Lombardia";
            }
        }
    }
};
</script>

<style scoped>
#home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--main-color);
}

.banner {
    width: 100%;
    height: 72vh;
    /* hacky */
    margin-top: 200px;
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
