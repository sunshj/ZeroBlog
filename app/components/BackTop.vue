<template>
  <Transition name="slide" mode="in-out">
    <div v-if="y > 300" class="right-10 hidden float-btn md:flex" @click="backToTop">
      <Icon
        name="lucide:arrow-up"
        :size="24"
        class="hover:animate-bounce-arrow-up dark:text-light-800"
      />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { y } = useWindowScroll()

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
