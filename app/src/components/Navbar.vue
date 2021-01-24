<template>
    <div id="nav">
        <router-link to="/">Home</router-link>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
#nav {
    border-left: none;
    border-right: none;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    text-align: center;
    font-size: 16px;
    line-height: 50px;
    padding: 0 25px;
    width: 80%;
    margin: 0 auto;
    margin-bottom: 30px;
    margin-top: 50px;
}
#nav a {
    padding: 0;
    line-height: 1.25;
    font-size: 20px;
    font-weight: normal;
    text-align: center;
    text-decoration: none;
    color: #000;
}
</style>