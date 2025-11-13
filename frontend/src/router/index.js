import { createRouter, createWebHistory } from 'vue-router'
import ProductListView from '@/views/ProductListView.vue'
import ProductCreateView from '@/views/ProductCreateView.vue'
import ProductEditView from '@/views/ProductEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'produtos',
      component: ProductListView,
    },
    {
      path: '/criar',
      name: 'criar',
      component: ProductCreateView
    },
    {
      path: '/editar/:id',
      name: 'editar',
      component: ProductEditView,
    },
    {
      path: '/deletar/:id',
      name: 'deletar',
      component: ProductListView,
  }
]
})

export default router
