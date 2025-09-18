
using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class GetProfileResponse
    {
        public Person User { get; set; }
        public double Wpm { get; set; }
        public double Accuracy { get; set; }
        public int TotalPlays { get; set; }
    }
}