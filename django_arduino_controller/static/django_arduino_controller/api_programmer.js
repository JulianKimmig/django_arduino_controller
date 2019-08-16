if (!logger)
    var logger = console;

if (typeof arduino_api_programmer === "undefined") {
    if (typeof arduino_api_controller === "undefined"){
        logger.error("Arduino API controller not loaded")
    }else {
        let api_programmer_api_selector_container = $('#api_programmer_api_selector_container');
        let api_programmer_api_function_selecor_title = $('#api_programmer_api_function_selecor_title');

        arduino_api_programmer = {
            apis: [],
            Api: class {
                activate(){
                    api_programmer_api_function_selecor_title.text(this.api.name.toString().replace(/([^])([A-Z])/g,"$1 $2"))
                }
                constructor(api){
                    this.api=api;
                    this.create_selector();
                }

                create_selector() {
                    this.selector = $("<div class='api-selector'></div>");
                    //this.selector.append(this.api.name.html());
                    this.api.name.link_to(function (value){this.selector.text(value.replace(/([^])([A-Z])/g,"$1 $2"))}.bind(this));
                    api_programmer_api_selector_container.append(this.selector);
                    this.selector.click(
                        this.activate.bind(this)
                    );
                }
            },
            add_api:function (api) {
                arduino_api_programmer.apis.push(new arduino_api_programmer.Api(api));
            }
        };
        let pre_add_api = arduino_api_controller.add_api;
        arduino_api_controller.add_api = function (api) {
            pre_add_api(api);
            arduino_api_programmer.add_api(api);
        }
    }
}