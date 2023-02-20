<template>

  <control-wrapper
    v-bind="input.controlWrapper.value"
    :styles="input.styles"
    :isFocused="!!input.isFocused"
    :appliedOptions="input?.appliedOptions"
  >
    <prism-editor
      class="htmleditor"
      v-model="control.data"
      :highlight="highlighter" line-numbers

      id="control.id + '-input'"
      :disabled="!control.enabled"
      :autofocus="input.appliedOptions.focus"
      :placeholder="input.appliedOptions.placeholder"
      @input="input.onChange"
      @focus="control.isFocused = true"
      @blur="control.isFocused = false"
    />
  </control-wrapper>
</template>

<style scoped>
.htmleditor {
  width:100%;
  aspect-ratio: 4/3;
  @apply

  font-mono
  p-1
  bg-gray-800
  text-gray-100
}
</style>

<script>
import {rendererProps, useJsonFormsControl} from '@jsonforms/vue';
import ControlWrapper from '@jsonforms/vue-vanilla/src/controls/ControlWrapper.vue';
import {useVanillaControl} from '@jsonforms/vue-vanilla/src/util';

import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';
import {and, optionIs, rankWith, uiTypeIs} from "@jsonforms/core";

export const htmlEditorRenderer = {
  components: {PrismEditor, ControlWrapper},
  props: rendererProps(),
  setup(props) {
    const input = useVanillaControl(useJsonFormsControl(props), target => target.value || undefined)
    const control = input.control

    const highlighter = (code) => {
      return highlight(code, languages.markup, 'html');
    };

    return {
      input, control,
      highlighter,
    }
  }
}

export default htmlEditorRenderer;
export const htmlEditorRendererEntry = {
  renderer: htmlEditorRenderer,
  tester: rankWith(2, and(uiTypeIs('Control'), optionIs('html', true)))
};

</script>
