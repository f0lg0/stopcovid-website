<template>
    <div id="app">
        <Navbar />
        <router-view />
    </div>
</template>


<script>
import Navbar from "./components/Navbar.vue";

export default {
    components: {
        Navbar
    }
};
</script>

<style>
#app {
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid;
    margin: 70px auto;
    padding: 0;
    max-width: 300px;
}

.abs-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
