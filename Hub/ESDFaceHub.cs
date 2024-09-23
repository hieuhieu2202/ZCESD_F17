using Microsoft.AspNet.SignalR;


public class ESDFaceHub : Hub
{
    private ESDFaceDAO employeeService = new ESDFaceDAO();
    public void GetEmployeeData(string equNo)
    {
        var employeeData = employeeService.GetEmployeeData(equNo);

        Clients.All.updateEmployeeData(employeeData);
    }
}