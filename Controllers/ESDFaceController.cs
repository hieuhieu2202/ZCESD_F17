// Controllers/EmployeeController.cs
using System.Collections.Generic;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;

public class ESDFaceController : Controller
{
    private readonly ESDFaceDAO _employeeService = new ESDFaceDAO();
    private readonly IHubContext _hubContext = GlobalHost.ConnectionManager.GetHubContext<ESDFaceHub>();
    public ActionResult ShowTestFail(string equno)
    {
        // Logic để lấy dữ liệu và gửi đến View
        // Ví dụ: Lấy danh sách nhân viên từ cơ sở dữ liệu
        //var employees = GetRealTimeData(); // Thay thế bằng logic thực tế của bạn
        ViewBag.Equno = equno;
        //return View(employees);
        return View();  
    }
    public ActionResult GetRealTimeData(string equNo)
    {
        var data = _employeeService.GetEmployeeData( equNo); // Lấy dữ liệu từ MySQL
        _hubContext.Clients.All.updateEmployeeData(data); // Gửi dữ liệu đến client
        return Json(data, JsonRequestBehavior.AllowGet);
    }
}
