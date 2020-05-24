"use strict";

module.exports = function(app)
{
    app.post("/api/webcli", function(req, res)
    {
        var result = new CmdResult("Invalid command", false, true);
        try
        {
            var args = getArgs(req.body.cmdLine);        //Split command line into token array
            var cmd  = args[0].toUpperCase();            //1st token is the command name
            result   = _commands[cmd].func(args);        //Run command
        }
        finally
        {
            res.send(result);  //Send result in our response
        }
    });
};

class CmdResult
{
    constructor(output, isHTML, isError)
    {
        this.output  = output  || "";     //Holds the success or error output
        this.isHTML  = isHTML  || false;  //Is the output a text string or an HTML string?
        this.isError = isError || false;  //True if output is an error message
    }
}

function getArgs(cmdLine)
{
    var tokenEx = /[^\s"]+|"[^"]*"/g;   //Matches (1 or more chars that are NOT space or ") or a " any # of chars not a quote, followed by a quote
    var quoteEx = /"/g;                 //Matches "
    var args = cmdLine.match(tokenEx);
    
    //Remove any quotes that may be in the args
    for(var i = 0; i < args.length; i++)
    {
        args[i] = args[i].replace(quoteEx, '');
    }
    return args;
}

var _commands = {}; //Holds the commands
class Command
{
    constructor(help, func)
    {
        this.help = help;  //Help description for the command
        this.func = func;  //Function that implements the command
    }
}

_commands.ECHO = new Command("Echos back the first <token> received", function(args)
{
    if (args.length >=2)
    {
        return new CmdResult(args[1]);    
    }
    return new CmdResult("");
});