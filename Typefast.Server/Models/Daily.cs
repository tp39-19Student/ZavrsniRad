

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Typefast.Server.Models
{
    [Table("Daily")]
    public class Daily
    {
        [Key]
        public int IdDai { get; set; }

        public int IdTex { get; set; }
        public long StartTime { get; set; }
    }
}