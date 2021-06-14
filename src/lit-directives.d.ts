import * as AsyncAppend from 'lit/directives/async-append';
import * as AsyncReplace from 'lit/directives/async-replace';
import * as Cache from 'lit/directives/cache';
import * as ClassMap from 'lit/directives/class-map';
import * as Guard from 'lit/directives/guard';
import * as Live from 'lit/directives/live';
import * as Ref from 'lit/directives/ref';
import * as Repeat from 'lit/directives/repeat';
import * as StyleMap from 'lit/directives/style-map';
import * as TemplateContent from 'lit/directives/template-content';
import * as UnsafeHtml from 'lit/directives/unsafe-html';
import * as UnsafeSvg from 'lit/directives/unsafe-svg';
import * as Until from 'lit/directives/until';

export const directives: {
  asyncAppend: typeof AsyncAppend;
  asyncReplace: typeof AsyncReplace;
  cache: typeof Cache;
  classMap: typeof ClassMap;
  guard: typeof Guard;
  live: typeof Live;
  ref: typeof Ref;
  repeat: typeof Repeat;
  styleMap: typeof StyleMap;
  templateContent: typeof TemplateContent;
  unsafeHtml: typeof UnsafeHtml;
  unsafeSvg: typeof UnsafeSvg;
  until: typeof Until;
};
