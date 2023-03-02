<template>

  <div class="container max-w-screen-lg mx-auto p-4 flex flex-col gap-4">

    <div class="styleA">
      Disable Formbuilder: <input type="checkbox" v-model="disableFormbuilder" /><br>
      Schema ReadOnly: <input type="checkbox" v-model="schemaReadOnly" /><br>
      Select Example:
      <select v-model="example" class="inline" >
        <option></option>
        <option v-for="e in examples" :value="e.name">{{e.label}}</option>
      </select>
      <a :href="'#/jsonforms?example=' + example" v-if="example" class="ml-1 text-sm">[open Jsonforms]</a>
    </div>

      <FormBuilder
          :jsonForms="jsonForms"
          :jsonFormsRenderers="jsonFormsRenderers"
          :schemaReadOnly="schemaReadOnly"
          :tools="tools"
          v-if="!disableFormbuilder"
          :key="example + (schemaReadOnly?1:0)"
      />
    <!--            -->

      <FormBuilderDetails :jsonForms="jsonFormsResolved" :key="(disableFormbuilder?1:0)" />

  </div>

</template>

<style>
.formbuilder nav {
 box-shadow: 0px 8px 8px -8px rgb(30, 30, 30, 30%);
  z-index:9;
 @apply
 sticky top-0 pt-2
}

</style>

<script setup lang="ts">

import {defaultTools, FormBuilder} from "@backoffice-plus/formbuilder";
import FormBuilderDetails from "./FormBuilderDetails.vue";
import {computed, onMounted, ref, unref, watch} from "vue";
import {getExamples} from '@jsonforms/examples/src'
import {generateDefaultUISchema} from "@jsonforms/core";
import {resolveSchema} from "@backoffice-plus/formbuilder";
import {getExampleFromUrl, getUrl} from "./lib";
import {vanillaRenderers} from "@jsonforms/vue-vanilla";
import {boplusVueVanillaRenderers} from "@backoffice-plus/formbuilder";
import {htmlTool, htmlRendererEntry} from "./tools/htmlTool";
import _ from "lodash";
import {schema as vuetifySchema, uischema as vuetifyUischema} from "./jsonForms/vuetifyOptions";
import {emitter} from "@backoffice-plus/formbuilder";
import type {EventAfterOptionJsonforms} from "@backoffice-plus/formbuilder";

const tools = [
    ...defaultTools,
  htmlTool,
]

const jsonFormsRenderers = Object.freeze([
  ...vanillaRenderers,
  ...boplusVueVanillaRenderers,
  ...[htmlRendererEntry]
]);

const oe = [];//import own examples

const url = computed(() => getUrl());
const examples = computed(() => getExamples().sort((a,b)=>a.label.toLowerCase()>b.label.toLowerCase()?1:-1));
const example = ref(getExampleFromUrl());
const schemaReadOnly = ref(false);
const disableFormbuilder = ref(false);
const jsonFormsResolved = ref({});

const jsonForms = computed(() => {
  const exampleData = getExamples().find(item => item.name===example.value);

  if(exampleData) {
    if(exampleData?.uischema && schemaReadOnly.value) {
      exampleData.uischema = {};
    }
    if(!exampleData?.uischema && !schemaReadOnly.value) {
      console.log("sandbox app","UiSschema generated because example is empty");
      exampleData.uischema = generateDefaultUISchema(exampleData.schema)
    }
  }

  return exampleData
});


watch(() => jsonForms.value, async () => {
  jsonFormsResolved.value = unref(jsonForms.value);
  //jsonFormsResolved.value.schema = await resolveSchema(jsonFormsResolved.value.schema);
})
watch(() => example.value, async () => {
  window.location.hash = example.value ? "/?example="+example.value : '';
})


emitter.on('afterOptionJsonforms', (event: EventAfterOptionJsonforms) => {
  const tool = event.tool;

  console.log("asd");

  if('Control' === tool.uischema?.type) {
    _.merge(event.schema, vuetifySchema);  //merge into schema
    event.uischema.elements.push(vuetifyUischema); //attach tab
  }
})

</script>
