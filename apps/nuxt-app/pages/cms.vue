<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GeinsCore, type GeinsCredentialsAPI, type GeinsAPILocalization } from '@geins/core';
import { GeinsCMS, type ContentAreaVariabels } from '@geins/cms';
const runtimeConfig = useRuntimeConfig()
// Initialize GeinsCore with credentials
const credentials: GeinsCredentialsAPI = {
    apiKey: runtimeConfig.public.geins.apiKey,
    accountName: runtimeConfig.public.geins.accountName,
};
const localization: GeinsAPILocalization = {
    ...(runtimeConfig.public.channel || {})
};
const myItems = ref<any[]>([]);

const menu = () => {
    const geinsCore = new GeinsCore({
        apiKey: runtimeConfig.public.geins.apiKey,
        accountName: runtimeConfig.public.geins.accountName,
    });
    const cms = new GeinsCMS(geinsCore);
    cms.menu.atLocation('main-desktop', localization).then((response) => {
        if (response.loading) {
            console.info('loading');
            return;
        }
        if (!response.data) {
            console.info('no data');
            return;
        }
        console.log(response.data);
        const data = response.data;
        myItems.value = [...data];
        console.log(myItems.value);
    });
};
const contentArea = () => {
    const geinsCore = new GeinsCore({
        apiKey: runtimeConfig.public.geins.apiKey,
        accountName: runtimeConfig.public.geins.accountName,
    });
    const cms = new GeinsCMS(geinsCore);
    const vars: ContentAreaVariabels = {
        widgetAlias: 'content-area',

    };

    cms.content.slug(vars, localization).then((response) => {
        if (response.loading) {
            console.info('loading');
            return;
        }
        if (!response.data) {
            console.info('no data');
            return;
        }
        console.log(response.data);
        const data = response.data;
        myItems.value = [...data];
        console.log(myItems.value);
    });

};
</script>
<template>
    <div>
        <h2>Nuxt Test</h2>
        <button @click="menu">Menu Get</button>
        <button @click="contentArea">Content Area</button>
        <button @click="page">Content Area</button>
        <ul>
            <template v-for="item in myItems" :key="item.id">
                <li>
                    <a :href="item.canonicalUrl">{{ item.title }}</a>
                    <ul v-if="item.children && item.children.length">
                        <li v-for="child in item.children" :key="child.id">
                            <a :href="child.canonicalUrl">{{ child.title }}</a>
                            <ul v-if="child.children && child.children.length">
                                <li v-for="grandChild in child.children" :key="grandChild.id">
                                    <a :href="grandChild.canonicalUrl">{{ grandChild.title }}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>
