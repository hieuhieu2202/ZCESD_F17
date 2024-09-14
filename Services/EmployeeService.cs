// Services/EmployeeService.cs
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using TestZCESD.Models;

public class EmployeeService
{
    private string connectionString = ConfigurationManager.ConnectionStrings["MySqlConnection"].ConnectionString;

    public List<UserRecords> GetEmployeeData()
    {
        var employeeList = new List<UserRecords>();

        string query = @"
            SELECT distinct
                userinfo.UserID AS 'MaThe', 
                userinfo.UserName AS 'HoTen',  
                dept.Name AS 'TenBoPhan',
                door_record.ErrCode AS 'ErrorCode',
                door_record.OperDt AS 'ThoiGian'
                FROM userinfo
                INNER JOIN dept ON userinfo.DeptId = dept.Id
                INNER JOIN door_record ON door_record.cardid = userinfo.UserID
                WHERE door_record.OperDt = (
                SELECT MAX(OperDt) 
                FROM door_record
                WHERE DATE(OperDt) = (
                SELECT MAX(DATE(OperDt)) 
                FROM door_record
                    )
                )";

        using (var connection = new MySqlConnection(connectionString))
        {
            var command = new MySqlCommand(query, connection);
            connection.Open();

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    string errorCodeText = reader.GetInt32("ErrorCode") == 0 ? "PASS" : "FAIL";

                    employeeList.Add(new UserRecords
                    {
                        MaThe = reader.GetString("MaThe"),
                        HoTen = reader.GetString("HoTen"),
                        TenBoPhan = reader.GetString("TenBoPhan"),
                        ErrorCode = errorCodeText,
                        ThoiGian = reader.GetDateTime("ThoiGian")
                    });
                }
            }
        }

        return employeeList;
    }
}
