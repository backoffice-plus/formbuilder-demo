<template>
  <!--  <control-wrapper-->
  <!--      v-bind="controlWrapper"-->
  <!--      :styles="styles"-->
  <!--      :isFocused="isFocused"-->
  <!--      :appliedOptions="appliedOptions"-->
  <!--  >-->
  <div v-html="body"/>

  <!--  </control-wrapper>-->
</template>

<script lang="ts">
import {rendererProps, useJsonFormsControl} from '@jsonforms/vue';
import {useVanillaControl} from '@jsonforms/vue-vanilla/src/util';
import {rankWith, uiTypeIs} from "@jsonforms/core";
import type {ControlProps} from "@jsonforms/vue/src/jsonFormsCompositions";

export const htmlRenderer = {
  props: rendererProps<ControlProps>(),
  setup(props:ControlProps) {
    const input = useVanillaControl(useJsonFormsControl(props)) as any

    const body = input?.appliedOptions?.value?.body;

    return {body}
  }
}

export default htmlRenderer;
export const htmlRendererEntry = {
  renderer: htmlRenderer,
  tester: rankWith(2, uiTypeIs('Html')),
};

</script>

