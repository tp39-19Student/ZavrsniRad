using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class Stat
    {
        public double Wpm { get; set; }
        public double Accuracy { get; set; }
    }

    public class GetProfileResponse
    {
        public Person User { get; set; }
        public Stat[] DailyStats { get; set; } // Past 30 days
        public Stat[] MonthlyStats { get; set; } // Past 12 months
    }
}