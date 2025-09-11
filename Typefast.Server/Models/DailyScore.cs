

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Typefast.Server.Models
{
    [Table("DailyScore")]
    public class DailyScore
    {
        [Key]
        public int IdDsc { get; set; }
        public int IdSco { get; set; }
    }
}