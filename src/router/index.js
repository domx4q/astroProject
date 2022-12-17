import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    // create a sub route folder so
    // /easter/clock
    // /easter/snake

    path: "/easter",
    name: "easter",
    redirect: {name: "home"},
    children: [
      {
        path: "clock",
        name: "clock",
        component: () => import("../views/easter/ClockView.vue")
      },
      {
        path: "snake",
        name: "snake",
        component: () => import("../views/easter/SnakeView.vue")
      },
      {
        path: "pacman",
        name: "pacman",
        component: () => import("../views/easter/PacmanView.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
