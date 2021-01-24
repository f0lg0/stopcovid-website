<template>
    <div id="app">
        <router-view />
    </div>
</template>


<script>
</script>

<style>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

:root {
    --main-color: #473f97;
}

#app {
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
