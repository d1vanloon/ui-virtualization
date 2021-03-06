import { Aurelia, PLATFORM } from 'aurelia-framework';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Scrollbar } from 'resources/scrollbar';

library.add(faEdit, faTrashAlt);
dom.watch();

const { VirtualRepeat } = require('aurelia-ui-virtualization');
VirtualRepeat.prototype.bind = (fn => {
  return function(...args: any[]) {
    window['virtualRepeat'] = this;
    return fn.apply(this, args);
  };
})(VirtualRepeat.prototype.bind);

export async function configure(aurelia: Aurelia) {
  try {
    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin(PLATFORM.moduleName('aurelia-ui-virtualization'))
      .globalResources([
        class {
          static $resource = {
            type: 'valueConverter',
            name: 'identity'
          };

          toView(val: any) {
            return val;
          }
        },
        class {
          static $resource = {
            type: 'valueConverter',
            name: 'cloneArray'
          };

          toView(val: any) {
            return Array.isArray(val) ? val.slice() : val;
          }
        },
        class {
          static $resource = {
            type: 'valueConverter',
            name: 'number'
          };

          fromView(val: string) {
            return Number(val) || 0;
          }
        },
        Scrollbar
      ] as any[]);

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
  } catch (ex) {
    document.body.textContent = ex;
    console.error(ex);
  }
}
