import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
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
      },
      {
        path: "reveal",
        name: "revealAnswer",
        component: () => import("../views/easter/RevealView.vue"),
        props: (route) => ({ token: route.query.token, admin: route.query.admin === "true"  })
      },
      {
        path: "colors",
        name: "colors",
        component: () => import("../views/easter/ColorsView.vue")
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/ErrorView.vue"),
    props: {
        code: 404,
        message: "Seite nicht gefunden"
    },
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
