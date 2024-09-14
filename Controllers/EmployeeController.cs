// Controllers/EmployeeController.cs
using System.Collections.Generic;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;

public class EmployeeController : Controller
{
    private readonly EmployeeService _employeeService = new EmployeeService();
    private readonly IHubContext _hubContext = GlobalHost.ConnectionManager.GetHubContext<EmployeeHub>();
    public ActionResult Index()
    {
        // Logic để lấy dữ liệu và gửi đến View
        // Ví dụ: Lấy danh sách nhân viên từ cơ sở dữ liệu
        var employees = GetRealTimeData(); // Thay thế bằng logic thực tế của bạn

        return View(employees);
    }
    public ActionResult GetRealTimeData()
    {
        var data = _employeeService.GetEmployeeData(); // Lấy dữ liệu từ MySQL
        _hubContext.Clients.All.updateEmployeeData(data); // Gửi dữ liệu đến client
        return Json(data, JsonRequestBehavior.AllowGet);
    }
}
