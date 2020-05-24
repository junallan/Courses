class WebCLI
{
    constructor()
    {
        var self = this;
        
        self.createElements();
    }
 
    createElements()
    {
        var self = this, doc = document;
        
        //Create & store CLI elements
        self.ctrlEl   = doc.createElement("div");   //CLI control (outer frame)
        self.outputEl = doc.createElement("div");   //Div holding console output
        self.inputEl  = doc.createElement("input"); //Input control
        
        //Add classes
        self.ctrlEl.className   = "webcli";
        self.outputEl.className = "webcli-output";
        self.inputEl.className  = "webcli-input";
        
        //Add attribute
        self.inputEl.setAttribute("spellcheck", "false");
        
        //Assemble them
        self.ctrlEl.appendChild(self.outputEl);
        self.ctrlEl.appendChild(self.inputEl);
        
        //Hide ctrl & add to DOM
        self.ctrlEl.style.display = "none";
        doc.body.appendChild(self.ctrlEl);
    }
}