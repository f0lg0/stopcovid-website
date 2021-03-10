<template>
    <AboutDesktop v-if="!$store.getters.mobile" />
    <div class="mobile" v-else>
        <h1>Pagina in costruzione!</h1>
        <p>Si consiglia la visione da computer</p>
    </div>
</template>

<script>
import AboutDesktop from "../components/desktop/About";

export default {
    components: {
        AboutDesktop,
    },
};
</script>

<style scoped>
.mobile {
    height: 100vh;
    background-color: var(--main-red);
    text-align: center;
    color: white;
}
</style>