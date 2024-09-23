using Microsoft.AspNet.SignalR;


public class ESDFaceHub : Hub
{
    private ESDFaceDAO employeeService = new ESDFaceDAO();
    public void GetEmployeeData(string workshop, string floor)
    {
        var employeeData = employeeService.GetEmployeeData(workshop,floor);

        Clients.All.updateEmployeeData(employeeData);
    }
}