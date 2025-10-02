
using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class GetProfileResponse
    {
        public required Person User { get; set; }
        public required double Wpm { get; set; }
        public required double Accuracy { get; set; }
        public required int TotalPlays { get; set; }
    }
}