﻿using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace TestZCESD.Controllers
{
    public class DashboardController : Controller
    {
        public ActionResult History()
        {
            return View();
        }

        public async Task<ActionResult> GetEmployeeData()
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync("http://10.220.130.116:2222/APIBYHIEU/api/ESDFace/GetEmployeeData?workshop=F06&floor=1F");
                var content = await response.Content.ReadAsStringAsync();
                return Content(content, "application/json");
            }
        }
        public ActionResult FullScreenHistory()
        {
            return View();
        }
    }
}
