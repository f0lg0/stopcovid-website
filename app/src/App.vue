<template>
    <div id="app">
        <router-view />
    </div>
</template>


<script>
export default {
    created() {
        this.$store.dispatch("checkMobile");
    },
    destroyed() {
        window.removeEventListener("resize", () => {});
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
