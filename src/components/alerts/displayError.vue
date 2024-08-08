<script>
  export default {
    props: {
      message: {
        type: String,
        default: null,
      },
    },
  };
</script>

<template>
    <div v-if="message" class="w-full flex justify-center">
      <p class="mt-1 text-red-500 text-xl font-bold">
        {{ message }}
      </p>
    </div>
</template>
    