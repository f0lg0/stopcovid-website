<template>
    <div id="switcher">
        <div
            class="option"
            @click="setActive(1)"
            :class="{ activeOp: active1 }"
        >
            <p>{{ op1 }}</p>
        </div>
        <div
            class="option"
            @click="setActive(2)"
            :class="{ activeOp: active2 }"
        >
            <p>{{ op2 }}</p>
        </div>
        <div
            class="option"
            @click="setActive(3)"
            :class="{ activeOp: active3 }"
        >
            <p>{{ op3 }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active1: true,
            active2: false,
            active3: false,
        };
    },
    props: {
        op1: {
            type: String,
            default: "Option 1",
        },
        op2: {
            type: String,
            default: "Option 2",
        },
        op3: {
            type: String,
            default: "Option 2",
        },
    },
    methods: {
        setActive(op) {
            if (op == 1 && this.active1 == false) {
                this.active1 = true;
                this.active2 = false;
                this.active3 = false;

                this.$emit("switched", op);
            } else if (op == 2 && this.active2 == false) {
                this.active1 = false;
                this.active2 = true;
                this.active3 = false;

                this.$emit("switched", op);
            } else if (op == 3 && this.active3 == false) {
                this.active1 = false;
                this.active2 = false;
                this.active3 = true;

                this.$emit("switched", op);
            }
        },
    },
};
</script>

<style scoped>
#switcher {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    background: #6c65ac;
    height: 60px;
    border-radius: 40px;
}

.option {
    padding: 10px;
    width: 30%;
    border-radius: 40px;
}

.option p {
    text-align: center;
    color: #fff;
}

.activeOp {
    background: #fff;
}

.activeOp p {
    color: var(--main-color);
}
</style>