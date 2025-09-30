

using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class MPRoom
    {
        public Text ChosenText { get; set; }
        public List<MPUser> Users { get; set; }
        public long StartTime { get; set; }
    }
}