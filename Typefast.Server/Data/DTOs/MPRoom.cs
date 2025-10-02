

using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class MPRoom
    {
        public required Text ChosenText { get; set; }
        public required List<MPUser> Users { get; set; }
        public required long StartTime { get; set; }
    }
}