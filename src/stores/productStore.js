import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      console.log('Fetching products...');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/product');    
        this.products = response.data.product;
        console.log('Products fetched:', this.products);
      } catch (error) {
        this.error = error;
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },

    async addProduct(product) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/product', product);
          this.products.push(response.data);
          await this.fetchProducts();
        } catch (error) {
          this.error = error;
          console.error('Error adding product:', error);
        }
    },


    async updateProduct(product) {
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/product/edit/${product.id}`, product);
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        await this.fetchProducts();
      } catch (error) {
        this.error = error;
        console.error('Error updating product:', error);
      }
    }, 
    
    async deleteProduct(id) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/product/delete/${id}`);
        this.products = this.products.filter(product => product.id !== id);
        await this.fetchProducts();
      } catch (error) {
        this.error = error;
        console.error('Error deleting product:', error);
      }
    },
  },

  getters: {
    productSummaryByType: (state) => {
      const summary = {};
      state.products.forEach(product => {
        if (!summary[product.type]) {
          summary[product.type] = {
            count: 0,
            totalPrice: 0,
          };
        }
        summary[product.type].count += product.count;
        summary[product.type].totalPrice += product.count * product.price;
      });
      return summary;
    },
  },
});
