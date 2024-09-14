// Startup.cs
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(TestZCESD.Startup))]

namespace TestZCESD
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Cấu hình SignalR
            app.MapSignalR();
        }
    }
}
