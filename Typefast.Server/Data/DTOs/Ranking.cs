

namespace Typefast.Server.Data.DTOs
{
    public class Ranking
    {
        public required int IdPer { get; set; }
        public required string Username { get; set; }
        public required double Wpm { get; set; }
        public required double Accuracy { get; set; }
    }
}