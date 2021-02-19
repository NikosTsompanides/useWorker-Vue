<template>
  <div>
    <div>Hello</div>
    <input type="text" v-model="search" />
    <button @click="getNews">Get News</button>
    <div>News: {{ news }}</div>
    <button style="margin-top: 40px" @click="getNumbers">
      Get Random Numbers
    </button>
    <div>Random Sum: {{ result }}</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { useWorker } from "../useWorker";

export default {
  data: () => ({
    result: 0,
    news: [],
    search: "",
    error: null,
  }),
  methods: {
    async getNumbers() {
      const randomNumbersSum = (length, multiplier) =>
        Array.from(
          { length },
          () => (Math.random() / 0.123456789101112) * multiplier
        ).reduce((acc, cur) => acc + cur, 0);

      const workerNumbers = useWorker(randomNumbersSum);
      this.result = await workerNumbers(Math.pow(10, 6), 5).catch(
        (err) => (this.error = err)
      );
    },
    async getNews() {
      if (!this.search.length || this.search.length < 3) return;
      const fetchNews = (term) =>
        fetch(`http://hn.algolia.com/api/v1/search?query=${term}`)
          .then((res) => res.json())
          .then((data) => data.hits);

      const workerFetch = useWorker(fetchNews);
      const results = await workerFetch(this.search).catch(
        (err) => (this.error = err)
      );
      this.news = results.map((hit) => hit.title);
    },
  },
};
</script>
>