<template>
  <div class="snake-game">
    <div class="score">
      Score: {{ score }}<br />
      High Score: {{ highScore }}<br />
      <i
        >Teleporting is <b>{{ teleport ? "enabled" : "disabled" }}</b></i
      >
    </div>
    <div class="board" :class="{ noBorder: !bordersEnabled, paused: paused }">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="{
            cell: true,
            snake: cell === 1,
            food: cell === 2,
            head: rowIndex === snakeHead.y && cellIndex === snakeHead.x,
          }"
          :style="{ width: tileSize, height: tileSize }"
        />
      </div>
    </div>
    <div class="controls">
      <ul>
        <li>Pause: <kbd>p</kbd></li>
        <li>Restart: <kbd>r</kbd> or <kbd>Esc</kbd></li>
        <li v-if="!isMobile">
          Navigate: <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> or
          <kbd>w</kbd><kbd>a</kbd><kbd>s</kbd><kbd>d</kbd>
        </li>
        <li v-else>Navigate: Swipe</li>
        <li>Toggle Borders: <kbd>b</kbd></li>
        <li>Toggle Wall Teleport: <kbd>t</kbd></li>
      </ul>
    </div>
  </div>
</template>

<script>
import defaults from "@/mixins/defaults";

export default {
  name: "SnakeView",
  mixins: [defaults],
  data() {
    return {
      count: 20,

      board: [],
      score: 0,
      highScore: 0,
      snake: [],
      snakeHead: { x: 0, y: 0 },
      food: [],
      direction: "down",
      teleport: true,

      paused: false,

      bordersEnabled: true,
      lastMovedDirection: "down",
      lastTouchStart: { x: -1, y: -1 },
    };
  },
  created() {
    document.addEventListener("keydown", this.handleKeyDown);
    // for mobile devices, they can "slide" to change direction
    document.addEventListener("touchstart", this.handleTouchStart);
    // document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);
  },
  mounted() {
    this.init();

    setInterval(() => {
      this.tick();
    }, 150);

    this.cssTileSize = this.tileSize;
  },
  methods: {
    init() {
      // choose a random direction
      this.direction = ["down", "down", "left", "right"][
        Math.floor(Math.random() * 4)
      ];
      this.board = [];
      this.score = 0;
      for (let i = 0; i < this.count; i++) {
        this.board.push([]);
        for (let j = 0; j < this.count; j++) {
          this.board[i].push(0);
        }
      }
      const startX = Math.floor(Math.random() * this.count);
      const startY = Math.floor(Math.random() * 18);
      this.snake = [
        { x: startX, y: startY },
        { x: startX, y: startY + 1 },
        { x: startX, y: startY + 2 },
      ];
      try {
        this.snake.forEach((cell) => {
          this.board[cell.y][cell.x] = 1;
        });
      } catch (e) {
        console.log(this.snake);
      }
      this.snakeHead = this.snake[this.snake.length - 1];
      this.generateFood();
    },
    tick() {
      if (this.paused) return;
      this.move();
    },

    move() {
      this.lastMovedDirection = this.direction;
      let newHead = { x: this.snakeHead.x, y: this.snakeHead.y };
      switch (this.direction) {
        case "up":
          newHead.y--;
          break;
        case "down":
          newHead.y++;
          break;
        case "left":
          newHead.x--;
          break;
        case "right":
          newHead.x++;
          break;
      }
      if (this.isGameOver(newHead, this.teleport)) {
        this.init();
        return;
      }
      // check if we can teleport
      if (this.teleport) {
        // check if step will teleport
        if (
          this.isGameOver(newHead, false) !== this.isGameOver(newHead, true)
        ) {
          // teleport
          // stay in array range, otherwise we will get an error
          if (newHead.x < 0) newHead.x = this.count - 1;
          if (newHead.x >= this.count) newHead.x = 0;
          if (newHead.y < 0) newHead.y = this.count - 1;
          if (newHead.y >= this.count) newHead.y = 0;
        }
      }
      this.snake.push(newHead);
      this.snakeHead = newHead;
      this.board[newHead.y][newHead.x] = 1;
      if (this.isFood(newHead)) {
        this.score++;
        this.generateFood();
      } else {
        let tail = this.snake.shift();
        this.board[tail.y][tail.x] = 0;
      }
    },

    generateFood() {
      let x = Math.floor(Math.random() * this.count);
      let y = Math.floor(Math.random() * this.count);
      while (this.board[y][x] !== 0) {
        x = Math.floor(Math.random() * this.count);
        y = Math.floor(Math.random() * this.count);
      }
      this.board[y][x] = 2;
      this.food = { x, y };
    },
    handleKeyDown(e) {
      if (this.paused && e.key !== "p") return;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "8": // numpad
          if (this.lastMovedDirection !== "down") {
            this.direction = "up";
          }
          break;
        case "ArrowDown":
        case "s":
        case "2": // numpad
          if (this.lastMovedDirection !== "up") {
            this.direction = "down";
          }
          break;
        case "ArrowLeft":
        case "a":
        case "4": // numpad
          if (this.lastMovedDirection !== "right") {
            this.direction = "left";
          }
          break;
        case "ArrowRight":
        case "d":
        case "6": // numpad
          if (this.lastMovedDirection !== "left") {
            this.direction = "right";
          }
          break;
        case "p":
          this.paused = !this.paused;
          break;
        case "Escape":
        case "r":
          this.init();
          break;
        case "b":
          this.bordersEnabled = !this.bordersEnabled;
          break;
        case "t":
          this.init();
          this.teleport = !this.teleport;
          break;
      }
    },
    handleTouchStart(e) {
      e.preventDefault();
      this.lastTouchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    handleTouchEnd(e) {
      e.preventDefault();
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      const diffX = touchEnd.x - this.lastTouchStart.x;
      const diffY = touchEnd.y - this.lastTouchStart.y;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" }),
          );
        } else {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft" }),
          );
        }
      } else {
        if (diffY > 0) {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowDown" }),
          );
        } else {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowUp" }),
          );
        }
      }
    },
  },
  computed: {
    isGameOver() {
      return (newHead, onlySelf = false) => {
        if (!onlySelf) {
          if (
            newHead.x < 0 ||
            newHead.x > this.count - 1 ||
            newHead.y < 0 ||
            newHead.y > this.count - 1
          ) {
            return true;
          }
        }
        try {
          return this.board[newHead.y][newHead.x] === 1;
        } catch (e) {
          return !onlySelf;
        }
      };
    },
    isFood() {
      return (newHead) => {
        return newHead.x === this.food.x && newHead.y === this.food.y;
      };
    },

    tileSize() {
      let borderSize = this.bordersEnabled ? 2 : 0;
      return (
        Math.min(this.screenSize.width, this.screenSize.height) / this.count -
        borderSize +
        "px"
      );
    },
  },
  watch: {
    score() {
      if (this.score > this.highScore) {
        this.highScore = this.score;
      }
    },
  },
};
</script>

<style scoped>
.snake-game {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.score {
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  font-size: 20px;
  text-align: right;
  padding: 10px;
  z-index: 100;
}
.board {
  width: auto;
  height: auto;
  position: relative;
}
.row {
  width: 100%;
  display: flex;
}
.cell {
  background-color: #fff;
  border: 1px solid black;
}
.snake {
  background-color: green;
}
.food {
  background-color: #f00;
}
.snake.head {
  background-color: #0f0;
}

.board.noBorder .cell {
  border: none;
}
.board.paused {
  opacity: 0.5;
}
.board.paused .cell.snake,
.board.paused .cell.food {
  background-color: #6e6e6e;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  z-index: 100;
}
li {
  margin: 0;
  padding: 0;
  font-size: 20px;
}
kbd {
  display: inline-block;
  padding: 3px 5px;
  border: 1px solid #fff;
  border-radius: 3px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  font-family: monospace;
  margin: 0 3px;
}
</style>
<style>
body {
  overscroll-behavior-y: contain; /*to prevent chrome mobile from reloading the page when swiping down*/
}
</style>
