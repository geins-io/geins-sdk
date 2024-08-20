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


const messages = ref<string[]>([]);

const myItems = ref<any[]>([]);
const handelClickCore = () => {
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
const handelClickCms = () => {

    const geinsCore = new GeinsCore({
        apiKey: runtimeConfig.public.geins.apiKey,
        accountName: runtimeConfig.public.geins.accountName,
    });
    const cms = new GeinsCMS(geinsCore);
    const vars: ContentAreaVariabels = {
        family: 'Frontpage',
        areaName: 'The front page area',
    };

    cms.content.area('Frontpage', 'The front page area', {}, localization).then((response) => {
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
        //myItems.value = [...data];
        console.log(myItems.value);
    });
};
const handelClickPage = () => {

    const geinsCore = new GeinsCore({
        apiKey: runtimeConfig.public.geins.apiKey,
        accountName: runtimeConfig.public.geins.accountName,
    });
    const cms = new GeinsCMS(geinsCore);
    const vars: ContentAreaVariabels = {
        family: 'Frontpage',
        areaName: 'The front page area',
    };

    cms.content.page('om-oss', {}, localization).then((response) => {
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
        //myItems.value = [...data];
        console.log(myItems.value);
    });
};
</script>
<template>
    <div>
        <h2>Nuxt Test</h2>
        <button @click="handelClickCore">Core</button>
        <button @click="handelClickCms">CMS</button>
        <button @click="handelClickCms">CMS</button>
        <button @click="handelClickPage">Page</button>

    </div>
</template>
