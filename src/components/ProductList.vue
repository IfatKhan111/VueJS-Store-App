<template>
    <div>
      <button @click="showAddModal">Add New Product</button>
      <div v-if="error">Error: {{ error.message }}</div>

      <PopModal :visible="isModalVisible" @close="hideModal">
        <form @submit.prevent="isEditMode ? updateProduct() : addNewProduct()" class="form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="currentProduct.name" required />
          </div>
          <div class="form-group">
            <label for="code">Code:</label>
            <input type="text" v-model="currentProduct.code" required />
          </div >
          <div class="form-group">
            <label for="specification">Specification:</label>
            <input type="text" v-model="currentProduct.specification" required />
          </div>
          <div class="form-group">
            <label for="type">Type:</label>
            <select v-model="currentProduct.type" required>
              <option value="ICT">ICT</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="text" v-model="currentProduct.price"/>
          </div>
          <div class="form-group">
            <label for="count">Count:</label>
            <input type="text" v-model="currentProduct.count"/>
          </div>
          <button type="submit" class="submit-btn">{{ isEditMode ? 'Update Item' : 'Add New Item' }}</button>
        </form>
      </PopModal>
  
      <table v-if="products.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Specification</th>
            <th>Type</th>
            <th>Price</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.code }}</td>
            <td>{{ product.specification }}</td>
            <td>{{ product.type }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.count }}</td>
            <td>
              <button @click="showEditModal(product)">Edit</button>
              <button @click="deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
        

      <ProductSummary />
      </div>
  </template>
  
  <script>
  import { ref, watch,onMounted, computed } from 'vue';
  import { useProductStore } from '../stores/productStore';
  import PopModal from './PopModal.vue';
  // import { debounce } from 'lodash'; 
  import ProductSummary from './ProductSummary.vue';
  
  export default {
    components: {
      PopModal,
      ProductSummary,
    },
    setup() {
      const productStore = useProductStore();

      const currentProduct = ref({
        id: null,
        name: '',
        code: '',
        specification: '',
        type: '',
        price:'',
        count:''
      });

      const isModalVisible = ref(false);
      const isEditMode = ref(false);

      const fetchProducts = () => {
        productStore.fetchProducts();
      };
  
      const addNewProduct = async () => {
        await productStore.addProduct({ ...currentProduct.value });
        resetForm();//newly added
        isModalVisible.value = false;
      };

      const showEditModal = (product) => {
        currentProduct.value = { ...product };
        isEditMode.value = true;
        isModalVisible.value = true;
      };

      const showAddModal = () => {
        resetForm();
        isEditMode.value = false;
        isModalVisible.value = true;
      };

      const updateProduct = async () => {
        await productStore.updateProduct(currentProduct.value);
        resetForm();
        isModalVisible.value = false;
      };

      const deleteProduct = async (id) => {
        await productStore.deleteProduct(id);
      };
      const resetForm = () => {
        currentProduct.value = { id: null, name: '', code: '', specification: '', type: '', price: 0, count: 0};
        isEditMode.value = false;
      };

      const hideModal = () => {
        resetForm();
        isModalVisible.value = false;
      };

      const products = computed(() => productStore.products);
      const loading = computed(() => productStore.loading);
      const error = computed(() => productStore.error);

      watch([products], () => {
        console.log('Products changed:', products.value);
      });
  
      onMounted(() => {
        fetchProducts();
        console.log('ProductList component mounted');
      });

      console.log('ProductList component setup executed');
  
      return {
        fetchProducts,
        addNewProduct,
        showEditModal,
        updateProduct,
        deleteProduct,
        products,
        loading,
        error,
        currentProduct,
        isModalVisible,
        isEditMode,
        showAddModal,
        hideModal,
      };
    },
  };
</script>
  

<style scoped>
button {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

.modal .form-group {
  margin-bottom: 15px;
}

.modal .form-group label {
  display: block;
  margin-bottom: 5px;
}

.modal .form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.modal .submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
}

.modal .submit-btn:hover {
  background-color: #218838;
}
</style>