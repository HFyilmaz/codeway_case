<template>
  <router-view></router-view>
</template>

<style>
@import '@mdi/font/css/materialdesignicons.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  min-height: 100vh;
  background-color: #1a1f2c;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #fff;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

input, button {
  font-size: 16px;
}

::placeholder {
  color: #8b92a5;
  opacity: 1;
}
</style>
