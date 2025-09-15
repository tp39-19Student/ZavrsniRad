

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Typefast.Server.Models
{
    [Table("Score")]
    public class Score
    {
        [Key]
        public int IdSco { get; set; }
        public int IdPer { get; set; }
        public int IdTex { get; set; }
        public DateOnly DatePlayed { get; set; }
        public double Time { get; set; }
        public double Accuracy { get; set; }

        public Person User { get; set; }
    }
}