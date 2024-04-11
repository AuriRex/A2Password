document.addEventListener("DOMContentLoaded", () => { SetupTerminal(); });

function SetupTerminal() {
    $('#terminal').terminal({
        help: function() {
            this.echo("");
            this.echo("Use the keyboard to write commands.");
            this.echo("Use [Enter/Return] to execute commands.");
            this.echo("Use [Backspace] to erase a character.");
            this.echo("Use [Tab] to autocomplete your command.");
            this.echo("Use [Up Arrow] to traverse your earlier executed commands.");
            this.echo("Use [ESC] to exit.");
            this.echo("");
            this.echo("Type \"COMMANDS\" to get a list of all available commands.");
            this.echo("");
        },
        commands: function(command) {
            this.echo("");
            this.echo("Available Commands:");
            this.echo("");
            this.echo("LIST\t\t\t\t\tDisplay a list of all essential items");
            this.echo("\t\t\t\t\t\tExample: LIST HSU ZONE_!, will only display data from Zone_1 containing 'HSU'");
            this.echo("");
            this.echo("QUERY\t\t\t\t\tQuery for detailed information about an item");
            this.echo("\t\t\t\t\t\tExample: QUERY HSU_123");
            this.echo("");
            this.echo("PING\t\t\t\t\tPing an item inside the current zone to get its location");
            this.echo("\t\t\t\t\t\tExample: PING KEY_123");
            this.echo("");
            this.echo("LOGS\t\t\t\t\tList any logs available on this terminal");
            this.echo("");
            this.echo("READ\t\t\t\t\tRead a text log on this terminal");
            this.echo("\t\t\t\t\t\tExample: READ myfile.txtx, will output the contents of 'myfile.txt'");
            this.echo("");
            this.echo("INFO\t\t\t\t\tDisplay information about this terminal");
            this.echo("");
            this.echo("HELP\t\t\t\t\tShow the help screen");
            this.echo("");
            this.echo("COMMANDS\t\t\t\tShow this command list");
            this.echo("");
            this.echo("CLS\t\t\t\t\t\tClear this terminal screen");
            this.echo("");
            this.echo("EXIT\t\t\t\t\tExit the terminal screen");
            this.echo("");
            this.echo("[[b;white;]DECRYPT_COMPLEX_PWD]\t\tAttempts to decrypt the complex password for a given date");
            this.echo("\t\t\t\t\t\tExample: DECRYPT_COMPLEX_PWD Dec 3 2023");
            this.echo("");
        },
        start: function(...cmd) {
            this.echo("");
            this.error("CRITICAL FAILURE");
        },
        logs: function() {
            this.echo("");
            this.echo("Listing all local logs available on this maintenance terminal")
            this.echo("");
            this.echo("FILE NAME\t\t\t\t\t\tFILE SIZE");
            this.echo("");
            this.echo("AUTO_GEN_STATUS.LOG\t\t\t\t3579");
            this.echo("");
        },
        list: function() {
            this.echo("");
            this.error("ERROR: Terminal not connected to local floor inventory systems.");
            this.echo("");
        },
        query: function(item) {
            this.echo("");
            this.error("ERROR: Terminal not connected to local floor inventory systems.");
            this.echo("");
        },
        ping: function(item) {
            this.echo("");
            this.error("ERROR: Terminal not connected to local floor inventory systems.");
            this.echo("");
        },
        read: function(...name) {
            name = name.join(' ')

            this.echo("ReadLog v1.12");
            this.echo("");

            if(name.toUpperCase() === "AUTO_GEN_STATUS.LOG") {
                this.error("Unable to read corrupt log file '" + name + "'!");
                this.echo("");
                return;
            }

            this.echo("ERROR: No Log found with filename '" + name + "'")
            this.echo("");
            this.echo("Usage: READ [FILENAME]");
            this.echo("");
            this.echo("Attributes:");
            this.echo("[FILENAME]\tThe name of the file to read");
            this.echo("");
            this.echo("Example: READ myfile.txt, will output the contents of 'myfile.txt'");
            this.echo("");
        },
        cls: function() {
            this.clear();
        },
        info: function() {
            this.greetings();
        },
        exit: function() {
            window.scrollBy({
                top: -10000,
                left: 0,
                behavior: "instant",
            });
        },
        decrypt_complex_pwd: function(...date) {
    
            if(date.length == 0) {
                date = new Date();
            } else {
                date = date.join(' ')
                try {
                    date = new Date(date);
                }
                catch(exception) {
                    this.echo(exception);
                    return;
                }
            }
    
            this.echo("");
            this.echo("[[;yellow;]Decrypting Complex Password ...]");
            this.echo("");

            if(date+"" === "Invalid Date") {
                this.error("ERROR: Invalid date provided!");
                this.echo("");
                return;
            }
    
            var week = date.getWeek();
            var year = date.getFullYear();
    
            var password = GenerateComplexPasswordForValues(year, week);
    
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            this.echo("" + date.toLocaleDateString("en-US", options));
            this.echo("");
            this.echo("Complex Password for week #" + week + ":");
            this.echo("[[b;white;]" + password + "]");
            this.echo("");
        }
    }, {
        checkArity: false,
        greetings: greetings.innerHTML,
        enabled: false,
        completion: true,
        onInit: (term) => OnInit(term),
        onAfterCommand: (cmd) => OnAfterCommand(cmd),
        onCommandNotFound: (cmd, term) => OnCommandNotFound(cmd, term),
        keymap: {
            'ESCAPE': function(e) {
                window.scrollBy({
                    top: -10000,
                    left: 0,
                    behavior: "instant",
                });
            }
        },
    });
}

function OnCommandNotFound(command, terminal) {
    terminal.echo("'" + command + "' is not recognized as a command.");
    terminal.echo("");
}

function OnAfterCommand(command) {
    let output = document.getElementsByClassName("terminal-output")[0];

    if (!output.hasChildNodes()) {
        return;
    }

    let children = output.children;
      
    for (const node of children) {
        if(node.classList.contains("terminal-command")) {
            let firstestChild = node.firstElementChild.firstElementChild;

            if(firstestChild.innerHTML.startsWith("&gt;&nbsp;")) {
                var actualCommand = firstestChild.innerHTML.split("&gt;&nbsp;", 2)[1];
                
                firstestChild.innerHTML = "\\\\ROOT\\" + actualCommand; 
            }
        }
    }
}

function OnInit(terminal) {
    console.log("Term has inited!");
    let span = document.getElementsByClassName("cmd-prompt")[0].childNodes[0].childNodes[0];

    span.style = "width: 7ch;";
    span.innerHTML = "\\\\ROOT\\";
}
