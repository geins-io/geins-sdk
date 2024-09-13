<script setup lang="ts">
import type { GeinsCredentials, ProductSearchVars } from '@geins/types';
import {
  logWrite,
  GeinsCore,
  ProductListSortType,
  ProductFilterModeType,
} from '@geins/core';
import { GeinsSearch } from '@geins/search';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);
const geinsSearch = new GeinsSearch(geinsCore);

const imageUrl = geinsCore.endpoints.image;

const items = ref<{ header: string; data: string }[]>([]);
const products = ref<any[]>([]);
const optionsTake = ref('50');
const optionsSkip = ref('0');
const searchTerm = ref('test');
const searching = ref(false);
const searchHits = ref(0);
const filterSort = ref(ProductListSortType.RELEVANCE);
const filterMode = ref(ProductFilterModeType.CURRENT);
const filterFacets = ref('');
const facetOptions = ref<any[]>([]);

const sortOptions = Object.entries(ProductListSortType).reduce(
  (acc, [key, value]) => {
    acc[key] = value;
    return acc;
  },
  {} as Record<string, ProductListSortType>,
);
const filterModeOptions = Object.entries(ProductFilterModeType).reduce(
  (acc, [key, value]) => {
    acc[key] = value;
    return acc;
  },
  {} as Record<string, ProductFilterModeType>,
);

const getSearch = async () => {
  searching.value = true;
  items.value = [];

  const vars: ProductSearchVars = {
    searchText: searchTerm.value,
    sort: filterSort.value,
    filterMode: filterMode.value,
    facets: filterFacets.value
      .replace(/\n/g, ',')
      .replace(/\s/g, '')
      .split(','),
    take: parseInt(optionsTake.value, 10),
    skip: parseInt(optionsSkip.value, 10),
  };

  const searchResult = await geinsSearch.product.get(vars);

  if (searchResult.data && searchResult.data.products) {
    const result = searchResult.data.products;
    searchHits.value = result.count;
    products.value = result.products;
  }

  if (searchHits.value > 0) {
    const facetResultParsed = await geinsSearch.product.getFiltersParsed(vars);
    for (let index = 0; index < facetResultParsed.length; index++) {
      const element = facetResultParsed[index];
      const facetIds = element.values.map((v) => v.facetId).join(', ');
      items.value.push({
        header: `"${element.label}" - type[${element.type}] - group[${element.group}]. Facets:`,
        data: facetIds,
      });
    }
  }
  searching.value = false;
};

const clear = async () => {
  items.value = [];
};

onMounted(() => { });
</script>
<template>
  <div>
    <h2>Nuxt @geins/search products</h2>
    <p>This is a search page for products</p>
    <p>
      <b>
        <a href="/"> GO BACK </a>
      </b>
    </p>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td><b>Filters:</b></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Sort:</td>
              <td>
                <select v-model="filterSort">
                  <option v-for="(value, key) in sortOptions" :key="key" :value="value">
                    {{ key }}
                  </option>
                </select>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Mode:</td>
              <td>
                <select v-model="filterMode">
                  <option v-for="(value, key) in filterModeOptions" :key="key" :value="value">
                    {{ key }}
                  </option>
                </select>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Facets:</td>
              <td>
                <textarea v-model="filterFacets" style="width: 300px; height: 100px"></textarea>
              </td>
              <td></td>
            </tr>
            <tr>
              <td><b>Options:</b></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Take:</td>
              <td><input v-model="optionsTake" style="width: 100px" /></td>
              <td></td>
            </tr>
            <tr>
              <td>Skip:</td>
              <td><input v-model="optionsSkip" style="width: 100px" /></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td>Search:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">
                <input v-model="searchTerm" style="width: 300px" />
              </td>
              <td>
                <button :disabled="searching" @click="getSearch">Search</button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td colspan="3"><button @click="clear">Clear</button></td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
          </table>
          <h3>Filter Facets:</h3>
          <div v-for="(item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b><br />
              <textarea v-model="item.data" style="border: 0; width: 600px; height: 100px"></textarea>
            </p>
          </div>
        </td>
        <td></td>

        <td style="padding-left: 50px; vertical-align: top">
          <p v-if="searching">Searching...</p>
          <div>
            <h3>Search hits: {{ searchHits }}</h3>

            <i>Possible facets for result: {{ facetOptions.length }}</i>
            <br />
            <br />
            <table>
              <tr style="font-weight: bold">
                <td>Geins Id:</td>
                <td>Image:</td>

                <td>Name:</td>
                <td>Brand:</td>
                <td>Price:</td>
                <td>slug:</td>
              </tr>
              <tr v-for="(product, index) in products" :key="index">
                <td>{{ product.productId }}</td>
                <td>
                  <img :src="`${imageUrl}/product/40x40/${product?.productImages[0]?.fileName}`" />
                </td>

                <td>{{ product.name }}</td>
                <td>{{ product.brand.name }}</td>
                <td>{{ product.unitPrice.sellingPriceIncVatFormatted }}</td>
                <td>
                  <a :href="`/product/${product.alias}`">
                    {{ product.alias }}
                  </a>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
