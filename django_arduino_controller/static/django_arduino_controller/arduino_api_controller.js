if(!logger)
    var logger = console;
if(typeof arduino_api_controller === "undefined") {
    arduino_api_controller = {
        api_ws_url:null,
        api_controll_panel:$('#controller_sidebar_content'),
        api_ws: new JsonWebsocket("Arduino Api Websocket"),
        check_apis: function () {
            arduino_api_controller.api_ws.cmd_message("get_apis")
        },
        clear_apis: function(){
            arduino_api_controller.apis = []
        },
        api_constructor: function (api) {
            let panel = $('<div id="api_control_panel_'+api.position+'"><div class="api_control_panel_title">'+api.name+'</div></div>');
            arduino_api_controller.api_controll_panel.append(panel);
            return panel;
        },
        API: class {
          constructor(name,position){
              this.name = name;
              this.position = position;
              this.container = arduino_api_controller.api_constructor(this);
              arduino_api_controller.api_ws.cmd_message("get_boards",{api:this.position})
          }
        },
        set_apis: function(data){
            arduino_api_controller.clear_apis();
            for(let i =0;i<data.data.length;i++){
                arduino_api_controller.apis.push(new arduino_api_controller.API(data.data[i],i))
            }
        },
    };



    arduino_api_controller.api_ws.add_on_connect_function(arduino_api_controller.check_apis);
    arduino_api_controller.api_ws.add_cmd_funcion("set_apis",arduino_api_controller.set_apis);
    $(document).ready(function() {
        if (arduino_api_controller.api_ws_url !== null) {
            arduino_api_controller.api_ws.connect(arduino_api_controller.api_ws_url);
        }
    });
}