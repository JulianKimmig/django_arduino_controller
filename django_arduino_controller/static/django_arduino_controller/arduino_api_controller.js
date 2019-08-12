if(!logger)
    var logger = console;
if(typeof arduino_api_controller === "undefined") {
    arduino_api_controller = {
        api_ws_url:null,
        api_ws: new JsonWebsocket("Arduino Api Websocket"),
        check_apis: function () {
            arduino_api_controller.api_ws.cmd_message("get_apis")
        }
    };

    arduino_api_controller.api_ws.add_on_connect_function(arduino_api_controller.check_apis);
    $(document).ready(function() {
        if (arduino_api_controller.api_ws_url !== null) {
            arduino_api_controller.api_ws.connect(arduino_api_controller.api_ws_url);
        }
    });
}