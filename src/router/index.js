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
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
    meta: { status: 404 }
  },
  {
    path: "/extra",
    name: "extra",
    redirect: {name: "home"},
    children: [
        {
          path: "stars",
          name: "stars",
          component: () => import("../views/extra/StarsView.vue")
        }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
