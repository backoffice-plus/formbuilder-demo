import type {JsonFormsInterface, ToolInterface} from "@backoffice-plus/formbuilder";
import {AbstractTool, prepareOptionDataRule, resolveSchema, setOptionDataRule} from "@backoffice-plus/formbuilder";

import htmlToolComponent from "./htmlToolComponent.vue";
import {schema, uischema} from "./htmlToolSchema";
import {htmlRendererEntry} from "./htmlRenderer.vue";
import {htmlEditorRendererEntry} from "./htmlEditorRenderer.vue";


export class HtmlTool extends AbstractTool implements ToolInterface {

  importer = () => htmlToolComponent;
  optionJsonformsRenderer = () => [htmlEditorRendererEntry];
  clone = (): ToolInterface => new HtmlTool(this.uischema.type);
  tester = htmlRendererEntry.tester;

  optionDataPrepare(tool: ToolInterface): Record<string, any> {

    //init data
    if (!this.uischema?.options?.body) {
      this.uischema.options = {body: '<code style="background-color:#eee;padding:4px">\n  HTML Tool\n</code>'};
    }

    return {
      options: this.uischema.options ?? {},
      ...prepareOptionDataRule(tool.schema, uischema),
    };
  };

  optionDataUpdate(tool: ToolInterface, data: Record<string, any>): void {
    this.uischema.options = data.options ?? {};

    setOptionDataRule(this.schema, this.uischema, data);
  };

  async optionJsonforms(tool: ToolInterface): Promise<JsonFormsInterface> {
    return {
      schema: await resolveSchema(schema),
      uischema: await resolveSchema(uischema),
    }
  };
}

export const htmlTool = new HtmlTool('Html')
