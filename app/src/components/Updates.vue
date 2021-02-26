<template>
    <div id="update_card">
        <h1 class="title">Novità</h1>
        <p class="text">{{text}}</p>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "Nothing :^)",
        },
    },
};
</script>

<style scoped>
#update_card {
    border-radius: 18px;
    height: 100px;
    background: #6c65ac;
}

.title {
    color: #fff;
    font-weight: 800;
    padding: 10px;
    margin-left: 10px;

    font-size: 25px;
}

.text {
    color: #fff;
    margin-left: 20px;

    font-size: 16px;
}
</style>