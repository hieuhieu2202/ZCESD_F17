using System;

namespace TestZCESD.Models
{
    public class UserRecords
    {
        public int STT { get; set; }
        public string MaThe { get; set; }
        public string HoTen { get; set; }
        public string TenBoPhan { get; set; }
        public string ErrorCode { get; set; }
        public DateTime ThoiGian { get; set; }
    }

    public class ChartData
    {
        public string Date { get; set; }
        public int Count { get; set; }
    }

    public class ChartData1
    {
        public string Date { get; set; }
        public int Count { get; set; }
    }
}
