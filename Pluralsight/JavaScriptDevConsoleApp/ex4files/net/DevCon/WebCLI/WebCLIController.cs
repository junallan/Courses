﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Http;

namespace DevCon
{
    public class WebCLIController : ApiController
    {
        static Type       AttributeType = typeof(ConsoleCommandAttribute);
        static List<Type> CommandTypes;

        static WebCLIController()
        {
            var type = typeof(IConsoleCommand);
            var types = AppDomain.CurrentDomain.GetAssemblies().SelectMany(asm => asm.GetTypes());

            CommandTypes = types.Where(t => t.GetInterfaces().Contains(type)).ToList();
        }

        //POST: api/webcli
        public ConsoleResult Post([FromBody]CommandInput command)
        {
            var args = command.GetArgs();
            var cmd  = args.First().ToUpper();
            Type cmdTypeToRun = null;

            //Get command type
            foreach (var cmdType in CommandTypes)
            {
                var attr = (ConsoleCommandAttribute)cmdType.GetTypeInfo().GetCustomAttributes(AttributeType).FirstOrDefault();
                if(attr != null && attr.Name.ToUpper() == cmd)
                {
                    cmdTypeToRun = cmdType; break;
                }
            }
            if(cmdTypeToRun == null) { return new ConsoleErrorResult(); }
            

            //Instantiate and run the command
            try
            {
                var cmdObj = Activator.CreateInstance(cmdTypeToRun) as IConsoleCommand;
                return cmdObj.Run(args);
            }
            catch
            {
                return new ConsoleErrorResult();
            }
        }
    }
}
