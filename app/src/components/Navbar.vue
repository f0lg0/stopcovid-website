<template>
    <div id="nav">
        <div id="desktop-wrapper" v-if="!$store.getters.mobile">
            <div class="links">
                <div id="main-link" class="tab">
                    <div :class="{ 'active-tab': isActive('home') }"></div>
                    <p @click.prevent="setActive('home')">Home</p>
                </div>
                <div class="space"></div>

                <div class="tab">
                    <div :class="{ 'active-tab': isActive('about') }"></div>
                    <p @click.prevent="setActive('about')">About</p>
                </div>
                <div class="tab">
                    <div :class="{ 'active-tab': isActive('chiamate') }"></div>
                    <p @click.prevent="setActive('chiamate')">Chiamate al 118</p>
                </div>
            </div>
        </div>

        <div id="small-wrapper" v-else>
            <div class="menu_container_small">
                <div class="home_link_container">
                    <router-link to="/" class="home_link">
                        <p class="center_with_abs">Home</p>
                    </router-link>
                </div>

                <div class="nav_links_container">
                    <div class="burger_menu_container">
                        <div class="burger_menu_subcontainer" id="burger_menu_icon">
                            <input type="checkbox" aria-label="Toggle menu" id="burger_menu_checkbox" />
                            <span></span>
                            <span></span>
                            <span></span>

                            <div class="burger_menu_cont" id="main_burger_menu">
                                <div class="burger_cont_links">
                                    <p @click.prevent="
                                            closeAndNavigate('about')
                                        ">About</p>
                                    <p @click.prevent="
                                            closeAndNavigate('chiamate')
                                        ">Chiamate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * Known bug: probably related to "the #" router mode, everytime the users refreshes the page the path goes back to home (/)
 * so the current active item at refresh is always going to be the home one
 */
export default {
    data() {
        return {
            activeItem: "home",
        };
    },

    methods: {
        isActive(menuItem) {
            return this.activeItem === menuItem;
        },
        setActive(menuItem) {
            this.activeItem = menuItem;

            // hacky but good enough
            if (!(this.$route.path == `/${menuItem}`)) {
                if (menuItem == "home") {
                    this.$route.path == "/" ? {} : this.$router.push("/");
                } else {
                    this.$router.push(menuItem);
                }
            }
        },

        closeAndNavigate(path) {
            // close burger
            const chck = document.getElementById("burger_menu_checkbox");
            chck.checked = !chck.checked;

            // redirect
            this.$router.push(path);
        },
    },
};
</script>

<style scoped>
/* Animations */
@keyframes burger_animation {
    from {
        width: 0px;
    }
    to {
        width: 100%;
    }
}

#nav {
    width: 100%;
    margin: auto;
    background-color: var(--main-red);
}

.links {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    color: white;
    padding-top: 50px;
}

.tab {
    margin-left: 10px;
    margin-right: 10px;
    position: relative;
}

.links p {
    flex-grow: 3;
    font-size: 20px;
    font-weight: 200;
}

.links p:hover {
    cursor: pointer;
    font-weight: 400;
}

@media only screen and (max-width: 1500px) {
    #main-link {
        margin-left: 0;
    }
}
/* .space {
    width: 40%;
} */

/* [BEGIN] MOBILE NAVBAR */

.menu_container_small {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px;
}

.home_link {
    width: 100px;
    height: 60px;
    position: relative;
    margin-left: 50px;
    margin-top: 10px;
    text-decoration: none;
}

.home_link p {
    color: white;
    font-weight: 400;
    font-size: 30px;
    padding-bottom: 3px;
}

.home_link p:hover {
    font-weight: bold;
}

.home_link_container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
}

.nav_links_container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-grow: 1;
}
/* Burger Menu Styling */
.burger_menu_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 75px;
    height: 100%;
    margin-right: 20px;
}
#burger_menu_checkbox {
    display: block;
    width: 25px;
    height: 25px;
    margin: 0;
    position: absolute;
    cursor: pointer;
    opacity: 0; /* hide this */
    z-index: 2; /* and place it over the hamburger */
    -webkit-touch-callout: none;
}
.burger_menu_subcontainer {
    width: 33px;
    display: inline-block;
    margin: 0 auto;
    z-index: 2;
}

.burger_menu_container span {
    display: block;
    height: 4px;
    width: 33px;
    margin-bottom: 5px;
    border-radius: 3px;
    background: white;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
        background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
}
/* Open burger menu */
.burger_menu_cont {
    overflow: hidden;
    display: none;
    animation: burger_animation 0.5s;
    position: absolute;
    right: 0;
    top: 0;
    height: 100vh;
    width: 100%;
    background-color: white;
    z-index: -1;
}
.burger_cont_links {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 80%;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    margin-top: 60px;
}
.burger_cont_links p {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-decoration: none;
    font-weight: 200;
    font-size: 24px;
    color: var(--main-red);
    width: 100%;
    height: 80px;
    margin-top: 30px;
    text-align: center;
}
.burger_cont_links p:hover {
    font-weight: 400;
}
/* Burger Menu functionality */
.burger_menu_subcontainer span:first-child {
    transform-origin: 0% 0%;
}
.burger_menu_subcontainer span:nth-child(3) {
    transform-origin: 0% 100%;
}
.burger_menu_subcontainer input:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(3px, -1px);
    background: var(--main-red);
}
.burger_menu_subcontainer input:checked ~ span:nth-child(4) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
}
.burger_menu_subcontainer input:checked ~ span:nth-child(3) {
    transform: rotate(-45deg) translate(-5px, 11px);
}
.burger_menu_subcontainer input:checked ~ .burger_menu_cont {
    display: block;
}
.burger_menu_subcontainer input:not(:checked) ~ .burger_menu_cont {
    display: none;
}
/* [END] MOBILE NAVBAR */
</style>