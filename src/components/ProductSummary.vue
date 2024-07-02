<template>
    <div>
      <h3>Product Summary by Type</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Total Count</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(summary, type) in productSummary" :key="type">
            <td>{{ type }}</td>
            <td>{{ summary.count }}</td>
            <td>${{ summary.totalPrice.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useProductStore } from '../stores/productStore';
  
  export default {
    setup() {
      const productStore = useProductStore();
      const productSummary = computed(() => productStore.productSummaryByType);
  
      return {
        productSummary,
      };
    },
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  