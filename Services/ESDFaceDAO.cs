// Services/EmployeeService.cs
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using TestZCESD.Models;

public class ESDFaceDAO
{
    private string connectionString = ConfigurationManager.ConnectionStrings["MySqlConnection"].ConnectionString;

    public List<ESDFaceModel> GetEmployeeData(string EquNo)
    {
        var employeeList = new List<ESDFaceModel>();

        
        string query = @"
                    SELECT 
                        t1.userid AS 'MaThe', 
                        t1.username AS 'HoTen',  
                        t1.tenbophan as 'TenBoPhan',
                        t1.errcode AS 'ErrorCode',
                        t1.operdt AS 'ThoiGian',
                        t1.resultflag,
                        CASE
                            WHEN t1.errcode = '1' 
                                 AND LEFT(t1.resultflag, 2) LIKE '%1%' 
                                 AND RIGHT(t1.resultflag, 2) LIKE '%1%' THEN '1'
                            WHEN t1.errcode = '1' 
                                 AND LEFT(t1.resultflag, 2) LIKE '%1%' THEN '2'
                            WHEN t1.errcode = '1' 
                                 AND RIGHT(t1.resultflag, 2) LIKE '%1%' THEN '3'
                            ELSE 'pass'
                        END AS 'Status'
                    FROM (
                        SELECT 
                            userinfo.userid, 
                            userinfo.username,  
                            dept.name AS 'TenBoPhan',
                            door_record.errcode,
                            door_record.operdt,
                            door_record.resultflag
                        FROM 
                            userinfo
                        INNER JOIN 
                            dept ON userinfo.deptid = dept.id
                        INNER JOIN 
                            door_record ON door_record.cardid = userinfo.userid
                        WHERE 
		                    EquNo = @EquNo AND
                            door_record.OperDt >= CURDATE() - INTERVAL 1 DAY 
                            AND door_record.OperDt < CURDATE() + INTERVAL 1 DAY
                    ) t1
                    INNER JOIN (
                        SELECT 
                            userinfo.userid, 
                            MAX(door_record.operdt) AS latest_operdt
                        FROM 
                            userinfo
                        INNER JOIN 
                            door_record ON door_record.cardid = userinfo.userid
                        WHERE 
                            door_record.OperDt >= CURDATE() - INTERVAL 1 DAY 
                            AND door_record.OperDt < CURDATE() + INTERVAL 1 DAY
                        GROUP BY 
                            userinfo.userid
                    ) t2 ON t1.userid = t2.userid AND t1.operdt = t2.latest_operdt
                    ORDER BY t1.operdt DESC;";

        using (var connection = new MySqlConnection(connectionString))
        {
            var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@EquNo", EquNo); // Truyền giá trị cửa vào tham số EquNo
            connection.Open();

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    string errorCodeText = reader.GetInt32("ErrorCode") == 0 ? "PASS" : "FAIL";
                    string status = "";
                    if (reader.GetString("Status").Equals("1"))
                    {
                        status = "Chân và tay không đạt giá trị";
                    }
                    if (reader.GetString("Status").Equals("2"))
                    {
                        status = "Tay không đạt giá trị";
                    }
                    if (reader.GetString("Status").Equals("3"))
                    {
                        status = "Chân không đạt giá trị";
                    }
                    employeeList.Add(new ESDFaceModel
                    {
                        MaThe = reader.GetString("MaThe"),
                        HoTen = reader.GetString("HoTen"),
                        TenBoPhan = reader.GetString("TenBoPhan"),
                        ErrorCode = errorCodeText,
                        Status = status,
                        ThoiGian = reader.GetDateTime("ThoiGian")
                    });
                }
            }
        }
        return employeeList;
    }
}
