import * as pWidget from "@lumino/widgets";

import { HTMLManager } from "@jupyter-widgets/html-manager";

import * as outputWidgets from "./output";

import { ShimmedComm } from "./services-shim";

export class ThebeManager extends HTMLManager {
  get onError() {
    return this._onError;
  }

  registerWithKernel(kernel) {
    console.log("registerWithKernel(kernel)");
    if (this._commRegistration) {
      this._commRegistration.dispose();
    }
    this._commRegistration = kernel.registerCommTarget(
      this.comm_target_name,
      (comm, message) => this.handle_comm_open(new ShimmedComm(comm), message)
    );
    this.kernel = kernel;
  }

  display_view(msg, view, options) {
    console.log("display_view(msg, view, options)");
    const el = options.el;
    return Promise.resolve(view).then((view) => {
      pWidget.Widget.attach(view.pWidget, el);
      view.on("remove", function () {
        console.log("view removed", view);
      });
      return view;
    });
  }

  loadClass(className, moduleName, moduleVersion) {
    console.log("loadClass(className, moduleName, moduleVersion)"); 
    if (moduleName === "@jupyter-widgets/output") {
      return Promise.resolve(outputWidgets).then((module) => {
        if (module[className]) {
          return module[className];
        } else {
          return Promise.reject(
            `Class ${className} not found in module ${moduleName}`
          );
        }
      });
    } else {
      return super.loadClass(className, moduleName, moduleVersion);
    }
  }

  callbacks(view) {
    console.log("callbacks(view)");
    console.log(view);
    const baseCallbacks = super.callbacks(view);
    return Object.assign({}, baseCallbacks, {
      iopub: { output: (msg) => this._onError.emit(msg) },
    });
  }

  _create_comm(target_name, model_id, data, metadata) {
    console.log("_create_comm()");
    const comm = this.kernel.createComm(target_name, model_id);
    if (data || metadata) {
      comm.open(data, metadata);
    }
    return Promise.resolve(new ShimmedComm(comm));
  }

  _get_comm_info() {
    console.log("_get_comm_info()");
    return this.kernel
      .requestCommInfo({ target: this.comm_target_name })
      .then((reply) => reply.content.comms);
  }
}
