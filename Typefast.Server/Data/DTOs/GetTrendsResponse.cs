using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class Stat
    {
        public DateOnly DatePlayed { get; set; }   
        public double Wpm { get; set; }
        public double Accuracy { get; set; }
    }

    public class GetTrendsResponse
    {
        public required List<Stat> DailyStats { get; set; } // Past 30 days
        public required List<Stat> MonthlyStats { get; set; } // Past 12 months
    }
}