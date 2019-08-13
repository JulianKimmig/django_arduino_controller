if (!logger)
    var logger = console;
if (typeof arduino_api_controller === "undefined") {
    arduino_api_controller = {
        api_ws_url: null,
        apis: [],
        api_controll_panel: $('#controller_sidebar_content'),
        api_ws: new JsonWebsocket("Arduino Api Websocket"),
        check_apis: function () {
            arduino_api_controller.api_ws.cmd_message("get_apis")
        },
        clear_apis: function () {
            for (let i = arduino_api_controller.apis.length - 1; i >= 0; i--) {
                arduino_api_controller.apis[i].remove();
            }
            arduino_api_controller.apis = []
        },
        api_constructor: function (api) {
            let panel = $('<div id="api_control_panel_' + api.position + '">' +
                '<div class="api_control_panel_title">' + api.name + '</div><div name="api_control_panel_boards"></div></div>');
            arduino_api_controller.api_controll_panel.append(panel);
            return panel;
        },
        board_constructor: function (board) {
            let panel = $('<div name="api_control_panel_board_' + board.position + '"></div>');
            let title = $('<div class="api_control_panel_board_title">' + board.board_class + '</div>');
            panel.append(title);
            let selector=$('<select name="board_selector" style="max-width: 100%"><option selected disabled="disabled">choose board</option></select>');
            for(let i=0;i<board.possible_boards.length;i++){
                let option = $('<option value="'+i+'"></option>');
                option.text(board.possible_boards[i]);
                selector.append(option);
                console.log(option,board.possible_boards[i],board.possible_boards[i] === board.linked_board);
                if(board.possible_boards[i] === board.linked_board){
                    option.attr('selected',true);
                }
            }
            panel.append(selector);
            return panel
        },
        Board: class {
            constructor(api, position, board_class, linked_board, possible_boards) {
                this.api = api;
                this.position = position;
                this.board_class = board_class;
                this.linked_board = linked_board;
                this.possible_boards = possible_boards;
                this.container = arduino_api_controller.board_constructor(this);
                this.api.boardbox.append(this.container);
            }

            remove() {
                let index = this.api.boardbox.indexOf(this.container);
                if (index > -1) {
                    this.api.boardbox.splice(index, 1);
                }
                this.container.remove();
                index = this.api.boards.indexOf(this);
                if (index > -1) {
                    this.api.boards.splice(index, 1);
                }
            }
        },
        API: class {
            constructor(name, position) {
                this.name = name;
                this.position = position;
                this.container = arduino_api_controller.api_constructor(this);
                this.boardbox = this.container.find("[name='api_control_panel_boards']");
                this.boards = []
            }

            remove() {
                this.clear_boards();
                this.container.remove();
            }

            set_boards(board_obj) {
                this.clear_boards();
                for (let i = 0; i < board_obj.required_boards.length; i++) {
                    this.add_board(new arduino_api_controller.Board(this, i, board_obj.required_boards[i], board_obj.linked_boards[i], board_obj.possible_boards[i]));
                }
            }

            clear_boards() {
                for (let i = this.boards.length - 1; i > 0; i--) {
                    this.boards[i].remove();
                }
                this.boards = [];
                this.boardbox.empty();
            }

            add_board(board) {
                this.boards.push(board);
            }
        },
        add_api: function (api) {
            arduino_api_controller.apis.push(api);
            arduino_api_controller.api_ws.cmd_message("get_boards", {api: api.position});
            arduino_api_controller.api_ws.cmd_message("get_status", {api: api.position});
        },
        set_apis: function (data) {
            arduino_api_controller.clear_apis();
            for (let i = 0; i < data.data.length; i++) {
                arduino_api_controller.add_api(new arduino_api_controller.API(data.data[i], i));
            }
        },
        set_boards: function (data) {
            arduino_api_controller.apis[data.data.api_position].set_boards(data.data)
        },
    };


    arduino_api_controller.api_ws.add_on_connect_function(arduino_api_controller.check_apis);
    arduino_api_controller.api_ws.add_cmd_funcion("set_apis", arduino_api_controller.set_apis);
    arduino_api_controller.api_ws.add_cmd_funcion("set_boards", arduino_api_controller.set_boards);
    $(document).ready(function () {
        if (arduino_api_controller.api_ws_url !== null) {
            arduino_api_controller.api_ws.connect(arduino_api_controller.api_ws_url);
        }
    });
}