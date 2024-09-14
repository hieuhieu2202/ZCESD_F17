using System.Collections.Generic;
using Microsoft.AspNet.SignalR;
using TestZCESD.Models;

public class EmployeeHub : Hub
{
    private EmployeeService employeeService = new EmployeeService();
    public void GetEmployeeData()
    {
        var employeeData = employeeService.GetEmployeeData();

        Clients.All.updateEmployeeData(employeeData);
    }
}