<template>
    <div id="app">
        <Navbar />
        <router-view />
    </div>
</template>


<script>
import Navbar from "./components/Navbar";

export default {
    created() {
        this.$store.dispatch("checkMobile");
    },
    destroyed() {
        window.removeEventListener("resize", () => {});
    },
    components: {
        Navbar,
    },
};
</script>

<style>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    user-select: none;
}

:root {
    --main-color: #473f97;
    --main-red: #713535;
}

body {
    background-color: #fcfafd;
}

@media screen and (max-width: 760px) {
    body {
        background-color: white;
    }
}

#app {
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

canvas {
    height: 520px;
}

.abs-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.flex-col-cent {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
