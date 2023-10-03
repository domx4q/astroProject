import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/easter",
    name: "easter",
    redirect: { name: "home" },
    children: [
      {
        path: "clock",
        name: "clock",
        component: () => import("../views/easter/ClockView.vue"),
      },
      {
        path: "snake",
        name: "snake",
        component: () => import("../views/easter/SnakeView.vue"),
      },
      {
        path: "pacman",
        name: "pacman",
        component: () => import("../views/easter/PacmanView.vue"),
      },
      {
        path: "reveal",
        name: "revealAnswer",
        component: () => import("../views/easter/RevealView.vue"),
        props: (route) => ({
          token: route.query.token,
          admin: route.query.admin === "true",
        }),
      },
      {
        path: "colors",
        name: "colors",
        component: () => import("../views/easter/ColorsView.vue"),
      },
      {
        path: "text",
        name: "text",
        component: () => import("../views/easter/LargeTextView.vue"),
        props: (route) => ({
          raw_text: route.query.text || route.query.t,
        }),
      }
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/ErrorView.vue"),
    props: {
      code: 404,
      message: "Seite nicht gefunden",
    },
    meta: { status: 404 },
  },
  {
    path: "/extra",
    name: "extra",
    redirect: { name: "home" },
    children: [
      {
        path: "stars",
        alias: ["/stars", "/stardisc", "/star", "/starmap"],
        name: "stars",
        component: () => import("../views/extra/StarsView.vue"),
      },
      {
        path: "example",
        name: "example",
        component: () => import("../views/extra/ExampleView.vue"),
      },
      {
        path: "download",
        name: "download",
        alias: ["/download", "/dl", "dl"],
        beforeEnter() {
          window.location.href = "https://github.com/domx4q/astroProject/releases/latest"
        }
      }
    ],
  },
];

let router;
if (process.env.BASE_URL === "/astroProject/") {
  console.info("Using hash history"); // skipcq: JS-0002
  router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
  });
} else {
  console.info("Using web history"); // skipcq: JS-0002
  router = createRouter({
    history: process.env.IS_ELECTRON
      ? createWebHashHistory(process.env.BASE_URL)
      : createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
      // possible Function parameters: to, from, savedPosition
      return { top: 0 }; // always scroll to top
    }
  });
}

export default router;
